const axios = require("axios");
require("dotenv").config();

const pinterestToken = process.env.PINTEREST_PERSONAL_ACCESS_TOKEN;

async function run() {
  console.log("Pinterest Personal Access Token:", pinterestToken ? pinterestToken.substring(0, 15) + "..." : "not set");
  if (!pinterestToken) {
    console.error("Token is not set in .env!");
    process.exit(1);
  }

  // 1. Get user account info
  console.log("\n--- 1. Fetching User Account Info ---");
  try {
    const userRes = await axios.get("https://api.pinterest.com/v5/user_account", {
      headers: { Authorization: `Bearer ${pinterestToken}` }
    });
    console.log("User Account:", JSON.stringify(userRes.data, null, 2));
  } catch (err) {
    console.error("User Account Error:", err.response?.data || err.message);
  }

  // 2. Fetch boards
  console.log("\n--- 2. Fetching Boards ---");
  let boardId = null;
  try {
    const boardsRes = await axios.get("https://api.pinterest.com/v5/boards", {
      headers: { Authorization: `Bearer ${pinterestToken}` }
    });
    console.log("Boards Response:", JSON.stringify(boardsRes.data, null, 2));
    if (boardsRes.data?.items && boardsRes.data.items.length > 0) {
      boardId = boardsRes.data.items[0].id;
      console.log(`Found board ID: ${boardId}`);
    } else {
      console.log("No boards found.");
    }
  } catch (err) {
    console.error("Boards Fetch Error:", err.response?.data || err.message);
  }

  // 3. Create default board if none found
  if (!boardId) {
    console.log("\n--- 3. Attempting to Create Board 'Vulpinix Ads' ---");
    try {
      const createRes = await axios.post("https://api.pinterest.com/v5/boards", {
        name: "Vulpinix Ads",
        description: "Created via Vulpinix Ad Manager",
        privacy: "PUBLIC"
      }, {
        headers: {
          Authorization: `Bearer ${pinterestToken}`,
          "Content-Type": "application/json"
        }
      });
      console.log("Create Board Response:", JSON.stringify(createRes.data, null, 2));
      boardId = createRes.data?.id;
    } catch (err) {
      console.error("Create Board Error:", err.response?.data || err.message);
    }
  }

  // 4. Create a test Pin if board is available
  if (boardId) {
    console.log("\n--- 4. Creating a Test Pin ---");
    try {
      const pinPayload = {
        title: "Vulpinix Test Pin",
        description: "This is a test pin created from the Vulpinix Pinterest Integration.",
        board_id: boardId,
        media_source: {
          source_type: "image_url",
          url: "https://i.ibb.co/1GVKVn5Q/e9998ace3c65.jpg"
        }
      };
      const pinRes = await axios.post("https://api.pinterest.com/v5/pins", pinPayload, {
        headers: {
          Authorization: `Bearer ${pinterestToken}`,
          "Content-Type": "application/json"
        }
      });
      console.log("Pin Creation Response:", JSON.stringify(pinRes.data, null, 2));
    } catch (err) {
      console.error("Pin Creation Error:", err.response?.data || err.message);
    }
  } else {
    console.error("Cannot create Pin: no board ID available.");
  }
}

run();
