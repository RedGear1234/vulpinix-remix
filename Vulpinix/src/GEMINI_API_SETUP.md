# Google Gemini AI Integration Setup

## Overview

This application uses Google Gemini AI to automatically generate engaging captions and hashtags for your social media content. The AI analyzes uploaded images and videos to create relevant, platform-optimized content.

## Getting Your Gemini API Key

### Step 1: Get API Key from Google AI Studio

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
1. Sign in with your Google account
1. Click "Get API Key" or "Create API Key"
1. Copy your API key (it will look like: `AIzaSyD...`)

### Step 2: Add API Key to Your Application

#### Option 1: Direct Replacement (Quick Testing Only)

⚠️ **NOT RECOMMENDED FOR PRODUCTION** - This exposes your API key in client-side code

1. Open `/pages/UploadPage.tsx`
1. Find line with: `const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";`
1. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
1. Example: `const GEMINI_API_KEY = "AIzaSyD1234567890abcdefghijk";`

#### Option 2: Environment Variables (Recommended for Development)

⚠️ **IMPORTANT**: This still exposes the key in browser - use backend proxy for production

1. Create a `.env` file in the root directory:

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

1. Update `/pages/UploadPage.tsx`:

```typescript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
```

1. Add `.env` to your `.gitignore` file to prevent committing secrets

#### Option 3: Backend Proxy (Production Ready) ⭐ RECOMMENDED

For production applications, create a backend API endpoint that:

1. Keeps your API key secure on the server
1. Accepts upload requests from your frontend
1. Calls Gemini API server-side
1. Returns results to frontend

Example backend endpoint:

```javascript
// Backend API (Node.js/Express example)
app.post('/api/generate-caption', async (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Secure server-side
  const { imageData, mimeType } = req.body;
  
  // Call Gemini API from server
  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...})
  });
  
  res.json(await response.json());
});
```

Then update frontend to call your backend:

```typescript
const response = await fetch('/api/generate-caption', {
  method: 'POST',
  body: JSON.stringify({ imageData, mimeType })
});
```

## How It Works

### Image Analysis

1. User uploads an image
1. Image is converted to base64 format
1. Sent to Gemini 1.5 Flash model with vision capabilities
1. AI analyzes the visual content
1. Generates contextually relevant caption and hashtags

### Video Analysis

1. User uploads a video
1. Text-based prompt is used (due to video processing limitations)
1. AI generates marketing-focused content
1. Returns professional captions and hashtags

### AI Prompt Structure

The AI receives this instruction:

```markdown
Analyze this image/video and generate engaging social media content for digital marketing purposes.

Please provide:
1. A captivating caption (2-3 sentences) for Instagram, Facebook, and LinkedIn
1. 5-7 relevant hashtags that maximize reach and engagement
1. Professional yet engaging tone suitable for business/marketing

Format: JSON
{
  "caption": "your engaging caption here with emojis",
  "hashtags": ["#Hashtag1", "#Hashtag2", ...]
}
```

## Features

### ✅ Supported Content Types

- **Images**: JPG, PNG, GIF, WebP, HEIC
- **Videos**: MP4, MOV, AVI, WebM, MKV, FLV, WMV

### ✅ AI Capabilities

- Visual content analysis
- Context-aware caption generation
- Industry-specific hashtag suggestions
- Emoji integration for engagement
- Multi-platform optimization

### ✅ Fallback System

If the API call fails or API key is not configured:

- Uses default professional captions
- Displays helpful error message
- Allows manual caption entry
- Ensures app continues to function

## API Pricing & Limits

### Google Gemini API - Free Tier

- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

### Gemini 1.5 Flash

- Fast and efficient
- Multi-modal (text + images)
- Perfect for this use case

### Upgrading

For higher limits, consider:

- Google AI Studio Pay-as-you-go
- Vertex AI on Google Cloud Platform

## Troubleshooting

### Error: "Using default captions. Please add your Gemini API key"

**Solution**: Your API key is not configured or invalid

1. Check if you replaced `YOUR_GEMINI_API_KEY_HERE` in `/pages/UploadPage.tsx`
1. Verify API key is active in [Google AI Studio](https://makersuite.google.com/app/apikey)
1. Check browser console (F12) for detailed errors

### Error: "API request failed: 400"

**Common causes**:

1. **Image format not supported** - Convert HEIC/HEIF to JPEG
1. **File too large** - Try compressing the image (recommended < 4MB)
1. **Invalid API endpoint** - Check the API URL is correct
1. **Malformed request** - Check browser console for request details

**Solutions**:

```bash
# Check browser console for full error message
# Look for: "Gemini API Error:" in console

# If image format issue, use JPG/PNG instead of HEIC
# If size issue, compress images before uploading
```

### Error: "API request failed: 403"

**Solution**: API key permissions issue

- Verify your API key is correct (should start with `AIza`)
- Regenerate your API key in Google AI Studio
- Ensure Gemini API is enabled for your project
- Check API key hasn't expired

### Error: "API request failed: 429"

**Solution**: Rate limit exceeded

- Free tier: 15 requests/minute, 1500/day
- Wait 1-2 minutes before retrying
- Consider implementing request caching
- Upgrade to paid tier if needed

### Error: "Could not parse response"

**Solution**: Response format issue

- Check browser console for the raw AI response
- The helper will try to extract JSON automatically
- May need to adjust prompt in `/utils/geminiHelper.ts`

### Captions Not Relevant to Image

**Solution**: Improve the AI prompt

1. Open `/utils/geminiHelper.ts`
1. Modify the `text` field in the request
1. Add more specific instructions about your industry
1. Include brand tone/voice requirements

Example customization:

```typescript
text: `Analyze this image for a [YOUR INDUSTRY] brand.
Generate content that is [TONE: professional/casual/fun].
Focus on [YOUR TARGET AUDIENCE].
...`
```

### Images Won't Upload

**Check**:

- File size (recommended < 10MB)
- File format (JPG, PNG, GIF, WebP supported)
- Browser console for error messages
- Network tab in DevTools for failed requests

## Security Best Practices

### ❌ Never Do This

```typescript
// DON'T: Hardcode API keys in committed code
const API_KEY = "AIzaSyD1234567890abcdefghijk";
```

### ✅ Always Do This

```typescript
// DO: Use environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// DO: Use backend proxy for production
const response = await fetch('/api/generate-caption', {...});

// DO: Add .env to .gitignore
```

## Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/quickstart)
- [Google AI Studio](https://makersuite.google.com/)
- [API Pricing](https://ai.google.dev/pricing)

## Support

For issues with:

- **Gemini API**: Visit [Google AI Support](https://ai.google.dev/support)
- **This Application**: Check browser console for error logs

---

**Note**: This integration is designed for development and testing. For production deployments, always use a secure backend proxy to protect your API keys.
