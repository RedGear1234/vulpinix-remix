const axios = require("axios");

async function testNewPollinations() {
  const prompt = "a modern cyberpunk coffee shop";
  const seed = 12345;
  const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=600&height=600&nologo=true&seed=${seed}`;
  
  console.log("Testing standard Pollinations URL:", url);
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    console.log("Success! Status:", res.status);
    console.log("Content-Type:", res.headers["content-type"]);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

testNewPollinations();
