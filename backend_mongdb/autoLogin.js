const puppeteer = require('puppeteer');

async function autoLogin() {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to auth URL...");
    await page.goto('http://localhost:5000/api/social/auth/facebook?userId=burno7584@gmail.com');
    
    console.log("Waiting for email input...");
    await page.waitForSelector('#email', { timeout: 10000 });
    await page.type('#email', 'kaustubhchaure68@gmail.com', { delay: 50 });
    
    console.log("Typing password...");
    await page.type('#pass', 'Mercusys@99', { delay: 50 });
    
    console.log("Clicking login...");
    await page.click('button[name="login"]');
    
    console.log("Browser is open on user's machine. Please watch the browser and click the final buttons if needed!");
    console.log("1. Click Continue.");
    console.log("2. CHECK THE BOX NEXT TO YOUR VULPINIX PAGE.");
    console.log("3. Click Done.");
    
    // Keep it open for 120 seconds so the user has plenty of time
    await new Promise(r => setTimeout(r, 120000));
    
  } catch (err) {
    console.error("Error during automation:", err.message);
    // Even if it errors (e.g. if the user clicks something manually before the script does),
    // keep the browser open so they can finish.
    await new Promise(r => setTimeout(r, 120000));
  } finally {
    console.log("Closing browser...");
    await browser.close();
  }
}

autoLogin();
