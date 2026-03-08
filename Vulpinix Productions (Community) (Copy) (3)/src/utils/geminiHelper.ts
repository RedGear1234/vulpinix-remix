// Helper functions for Gemini AI integration

export interface GeminiCaptionResult {
  caption: string;
  hashtags: string[];
}

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const generateCaptionWithGemini = async (
  file: File,
  apiKey: string
): Promise<GeminiCaptionResult> => {
  // Check if API key is configured
  if (apiKey === "YOUR_GEMINI_API_KEY_HERE" || !apiKey) {
    throw new Error("API key not configured");
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Determine content type
  const isImage = file.type.startsWith('image/');

  let requestBody: any;

  if (isImage) {
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    const base64Content = base64Data.split(',')[1] || base64Data;

    // Get proper mime type
    let mimeType = file.type;

    // Convert HEIC to supported format
    if (mimeType === 'image/heic' || mimeType === 'image/heif') {
      mimeType = 'image/jpeg';
    }

    // Request body for image analysis
    requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Content
              }
            },
            {
              text: `Analyze this image and generate engaging social media content.

Provide:
1. A captivating caption (2-3 sentences) for Instagram, Facebook, and LinkedIn
2. 5-7 relevant hashtags for maximum engagement

Respond with ONLY valid JSON:
{
  "caption": "your caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    };
  } else {
    // For videos, use text-only prompt
    requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Generate engaging social media content for a video about digital marketing and AI.

Provide:
1. A captivating caption (2-3 sentences) for Instagram, Facebook, and LinkedIn
2. 5-7 relevant hashtags for maximum engagement

Respond with ONLY valid JSON:
{
  "caption": "your caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    };
  }

  // Call Gemini API
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini API Error:", errorData);
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  // Extract generated text
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!generatedText) {
    throw new Error("No content generated");
  }

  // Parse JSON response
  let parsedContent: GeminiCaptionResult;
  
  try {
    // Remove markdown code blocks
    let cleanedText = generatedText.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Extract JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedContent = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found");
    }

    // Validate
    if (!parsedContent.caption || !parsedContent.hashtags) {
      throw new Error("Invalid JSON structure");
    }
  } catch (parseError) {
    // Manual extraction fallback
    const captionMatch = generatedText.match(/"caption"\s*:\s*"([^"]*)"/);
    const hashtagsMatch = generatedText.match(/"hashtags"\s*:\s*\[(.*?)\]/s);

    if (captionMatch) {
      const caption = captionMatch[1];
      let hashtags = ["#DigitalMarketing", "#AI", "#Marketing"];

      if (hashtagsMatch) {
        hashtags = hashtagsMatch[1]
          .split(',')
          .map(h => h.trim().replace(/["\s]/g, ''))
          .filter(h => h.startsWith('#'));
      }

      parsedContent = { caption, hashtags };
    } else {
      throw new Error("Could not parse response");
    }
  }

  return parsedContent;
};
