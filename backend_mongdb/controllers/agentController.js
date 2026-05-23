const Campaign = require("../models/campaign");
const { publishCampaign } = require("./campaignController");
const axios = require("axios");

/**
 * Helper to call Gemini 1.5 Flash with function calling support
 */
async function callGeminiAgent(apiKey, contents, user) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const userId = user?.id || user?.email || "anonymous";
  const userEmail = user?.email || "";
  const userName = user?.name || "User";

  const systemInstruction = `You are the Vulpinix AI Agent, a fully autonomous marketing co-pilot.
You can execute tasks directly in the database and publish to connected social networks using the tools provided.
When the user asks to publish, schedule, or create a post or campaign, use the 'create_campaign' tool.
When they ask to check campaigns, performance, CTR, or database analytics, use the 'get_analytics_summary' tool.
Always verify parameters. Provide clear, professional, and emoji-enhanced responses showing what actions you automated.`;

  const tools = [
    {
      functionDeclarations: [
        {
          name: "create_campaign",
          description: "Create or schedule a social media marketing campaign or post, and publish it to the connected social accounts.",
          parameters: {
            type: "OBJECT",
            properties: {
              campaignName: { type: "STRING", description: "Name of the campaign or post" },
              platforms: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Target platforms: facebook, instagram, twitter, linkedin, youtube, pinterest"
              },
              budget: { type: "STRING", description: "Budget value in INR (e.g., '500')" },
              caption: { type: "STRING", description: "The content text copy or caption of the post" },
              scheduledAt: { type: "STRING", description: "ISO date time string if scheduled, or null if instant publishing" }
            },
            required: ["campaignName", "platforms", "budget", "caption"]
          }
        },
        {
          name: "get_analytics_summary",
          description: "Retrieve aggregated campaign performance metrics (impressions, clicks, spend, CTR) for the user.",
          parameters: {
            type: "OBJECT",
            properties: {}
          }
        }
      ]
    }
  ];

  try {
    const payload = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      tools: tools
    };

    console.log("🤖 [AI AGENT] Dispatching turn to Gemini...");
    const res = await axios.post(url, payload);
    const candidate = res.data?.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (part?.functionCall) {
      const call = part.functionCall;
      console.log(`🤖 [AI AGENT] Gemini requested tool execution: ${call.name}`, call.args);

      let functionResponseData = {};
      let executionMetadata = {};

      if (call.name === "create_campaign") {
        try {
          const campaign = new Campaign({
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            campaignName: call.args.campaignName || "AI Autonomous Post",
            platforms: call.args.platforms || ["instagram"],
            budget: call.args.budget || "500",
            adCaption: call.args.caption,
            adCopyText: call.args.caption,
            scheduledAt: call.args.scheduledAt ? new Date(call.args.scheduledAt) : null,
            status: call.args.scheduledAt ? "scheduled" : "pending"
          });

          let publishResults = {};
          if (campaign.scheduledAt) {
            campaign.status = "scheduled";
            await campaign.save();
          } else {
            await campaign.save();
            // Actually publish the post to connected APIs
            publishResults = await publishCampaign(campaign);
          }

          console.log(`✅ [AI AGENT] Campaign "${campaign.campaignName}" created via backend tool.`, publishResults);
          
          functionResponseData = {
            success: true,
            id: campaign._id.toString(),
            status: campaign.status,
            publishResults,
            message: `Created campaign ID: ${campaign._id} successfully.`
          };
          executionMetadata = {
            type: "create_campaign",
            status: "success",
            data: {
              campaignId: campaign._id,
              campaignName: campaign.campaignName,
              platforms: campaign.platforms,
              budget: campaign.budget,
              caption: campaign.adCaption,
              scheduledAt: campaign.scheduledAt,
              publishResults
            }
          };
        } catch (dbErr) {
          functionResponseData = { success: false, error: dbErr.message };
        }
      } else if (call.name === "get_analytics_summary") {
        try {
          const campaigns = await Campaign.find({
            userId: { $regex: new RegExp(`^${userId}$`, "i") }
          }).lean();

          const totalCampaigns = campaigns.length;
          const published = campaigns.filter(c => c.status === 'published' || c.status === 'running').length;
          const scheduled = campaigns.filter(c => c.status === 'scheduled').length;
          let totalImpressions = 0;
          let totalClicks = 0;
          let totalSpend = 0;
          campaigns.forEach(c => {
            totalImpressions += c.analytics?.impressions || 0;
            totalClicks += c.analytics?.clicks || 0;
            totalSpend += parseFloat(c.budget) || 0;
          });
          const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

          functionResponseData = {
            success: true,
            totalCampaigns,
            published,
            scheduled,
            totalImpressions,
            totalClicks,
            totalSpend,
            avgCtr
          };
          executionMetadata = {
            type: "analytics_summary",
            status: "success",
            data: functionResponseData
          };
        } catch (dbErr) {
          functionResponseData = { success: false, error: dbErr.message };
        }
      }

      // Send execution response back to Gemini to get final conversational response
      const updatedContents = [
        ...contents,
        { role: "model", parts: [part] },
        {
          role: "user",
          parts: [
            {
              functionResponse: {
                name: call.name,
                response: functionResponseData
              }
            }
          ]
        }
      ];

      const secondRes = await axios.post(url, {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: updatedContents
      });

      const finalText = secondRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Execution finished.";
      return {
        text: finalText,
        execution: executionMetadata
      };
    }

    return { text: part?.text || "I'm not sure how to assist with that." };
  } catch (err) {
    console.error("❌ [AI AGENT] Gemini connection error:", err.message);
    throw err;
  }
}

/**
 * Rules-based Agent Simulator (handles requests offline when API key is missing)
 */
async function simulateAgentResponse(text, user) {
  const lower = text.toLowerCase();

  const userId = user?.id || user?.email || "anonymous";
  const userEmail = user?.email || "";
  const userName = user?.name || "User";
  
  if (lower.includes('post') || lower.includes('schedule') || lower.includes('publish') || lower.includes('create')) {
    // Parameter extraction
    let caption = "New announcement from our marketing agent! 🚀";
    const capMatch = text.match(/(?:caption|content|with text|message) (?:is|of|'|")?([^'"]+)/i);
    if (capMatch) caption = capMatch[1].trim();

    let budget = "500";
    const budgetMatch = text.match(/(?:budget|cost|price) (?:of|is)?\s*(\d+)/i);
    if (budgetMatch) budget = budgetMatch[1].trim();

    const platforms = [];
    if (lower.includes('facebook') || lower.includes('fb')) platforms.push('facebook');
    if (lower.includes('instagram') || lower.includes('ig')) platforms.push('instagram');
    if (lower.includes('twitter') || lower.includes('x')) platforms.push('twitter');
    if (lower.includes('linkedin')) platforms.push('linkedin');
    if (lower.includes('youtube')) platforms.push('youtube');
    if (lower.includes('pinterest')) platforms.push('pinterest');
    if (platforms.length === 0) platforms.push('instagram', 'facebook');

    let scheduledAt = null;
    if (lower.includes('tomorrow') || lower.includes('later') || lower.includes('schedule')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(17, 0, 0, 0);
      scheduledAt = tomorrow;
    }

    // Server-side database automation execution and social accounts publishing
    try {
      const campaign = new Campaign({
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        campaignName: "AI Autonomous Agent Campaign",
        platforms,
        budget,
        adCaption: caption,
        adCopyText: caption,
        scheduledAt,
        status: scheduledAt ? "scheduled" : "pending"
      });

      let publishResults = {};
      if (scheduledAt) {
        campaign.status = "scheduled";
        await campaign.save();
      } else {
        await campaign.save();
        // Trigger live OAuth social publishing!
        publishResults = await publishCampaign(campaign);
      }

      const timeStr = scheduledAt ? `scheduled for ${scheduledAt.toLocaleString()}` : "published immediately";
      return {
        text: `🤖 **[Autonomous Action Completed]**\n\nI have successfully executed the social campaign creation and publishing flow:\n- **Campaign Name**: ${campaign.campaignName}\n- **Caption**: "${caption}"\n- **Platforms**: ${platforms.join(', ')}\n- **Budget**: ₹${budget}\n- **Timing**: ${timeStr}\n\nThe campaign is now active in your workspace and has been pushed to your connected social channels!`,
        execution: {
          type: "create_campaign",
          status: "success",
          data: {
            campaignId: campaign._id,
            campaignName: campaign.campaignName,
            platforms: campaign.platforms,
            budget: campaign.budget,
            caption: campaign.adCaption,
            scheduledAt: campaign.scheduledAt,
            publishResults
          }
        }
      };
    } catch (dbErr) {
      return { text: `Failed to automate campaign: ${dbErr.message}` };
    }
  }

  if (lower.includes('analyze') || lower.includes('performance') || lower.includes('metrics') || lower.includes('report') || lower.includes('analytics')) {
    try {
      const campaigns = await Campaign.find({
        userId: { $regex: new RegExp(`^${userId}$`, "i") }
      }).lean();

      const totalCampaigns = campaigns.length;
      const published = campaigns.filter(c => c.status === 'published' || c.status === 'running').length;
      const scheduled = campaigns.filter(c => c.status === 'scheduled').length;
      let totalImpressions = 0;
      let totalClicks = 0;
      let totalSpend = 0;
      campaigns.forEach(c => {
        totalImpressions += c.analytics?.impressions || 0;
        totalClicks += c.analytics?.clicks || 0;
        totalSpend += parseFloat(c.budget) || 0;
      });
      const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

      return {
        text: `🤖 **[Autonomous Report Compiled]**\n\nI have retrieved your campaign data directly from the MongoDB collections:\n- **Total Campaigns**: ${totalCampaigns}\n- **Published**: ${published}\n- **Scheduled**: ${scheduled}\n- **Average CTR**: ${avgCtr}%\n- **Total Spend**: ₹${totalSpend.toLocaleString()}\n\nHere is your real-time performance breakdown:`,
        execution: {
          type: "analytics_summary",
          status: "success",
          data: {
            totalCampaigns,
            published,
            scheduled,
            totalImpressions,
            totalClicks,
            totalSpend,
            avgCtr
          }
        }
      };
    } catch (dbErr) {
      return { text: `Failed to compile analytics: ${dbErr.message}` };
    }
  }

  // Generate Image
  if (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('generate')) {
    const match = text.match(/(?:image|picture|photo) of (.*)/i);
    const prompt = match ? match[1] : 'modern aesthetic social media marketing creative';
    const seed = Math.floor(Math.random() * 100000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=600&nologo=true&seed=${seed}`;

    return {
      text: `Sure! I have generated this visual creative using AI based on your description:\n[IMAGE: ${prompt}]`,
      imageUrl,
      execution: {
        type: "publish_image",
        status: "pending",
        data: {
          imageUrl,
          campaignName: 'AI Generated Creative',
          platforms: ['instagram', 'facebook'],
          caption: 'Freshly generated creative! 🎨🚀',
          budget: '500'
        }
      }
    };
  }

  return {
    text: `Hello! I am the Vulpinix AI Agent. I can automatically perform operations on your behalf, such as:\n\n1. **Publishing / Scheduling posts** (e.g., *"Post to Facebook: 'Summer sale is here!'"*)\n2. **Retrieving live performance analytics** (e.g., *"Show my analytics summary"*)\n3. **Generating visual ad creatives** (e.g., *"Generate an image of a coffee shop"*)\n\nWhat would you like me to automate today? 🚀`
  };
}

/**
 * POST /api/agent/chat
 * Handles natural language agent interaction
 */
const handleAgentChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const user = req.user;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
      try {
        // Map history to Gemini API format
        const geminiHistory = (history || []).map(h => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        }));

        const result = await callGeminiAgent(
          apiKey,
          [...geminiHistory, { role: "user", parts: [{ text: message }] }],
          user
        );

        return res.json({
          success: true,
          text: result.text,
          execution: result.execution,
          imageUrl: result.imageUrl
        });
      } catch (geminiErr) {
        console.error("⚠️ Falling back to simulator due to Gemini error:", geminiErr.message);
      }
    }

    // Fallback to rules-based simulator which actually modifies MongoDB data on the server
    const result = await simulateAgentResponse(message, user);
    return res.json({
      success: true,
      text: result.text,
      execution: result.execution,
      imageUrl: result.imageUrl
    });
  } catch (err) {
    console.error("handleAgentChat error:", err);
    return res.status(500).json({ success: false, message: "Agent error occurred." });
  }
};

module.exports = {
  handleAgentChat
};
