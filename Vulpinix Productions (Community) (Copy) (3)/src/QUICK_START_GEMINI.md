# Quick Start: Gemini AI Captions

## ⚡ 3-Minute Setup

### Step 1: Get Your API Key (1 minute)
1. Go to **[Google AI Studio](https://makersuite.google.com/app/apikey)**
2. Click **"Get API Key"** or **"Create API Key"**
3. Copy the key (looks like: `AIzaSyD...`)

### Step 2: Add API Key to Code (1 minute)
1. Open `/pages/UploadPage.tsx`
2. Find line ~367 (search for `YOUR_GEMINI_API_KEY_HERE`)
3. Replace with your key:
```typescript
const GEMINI_API_KEY = "AIzaSyD1234567890abcdefghijk"; // Your actual key
```
4. Save the file

### Step 3: Test It! (1 minute)
1. Run your app
2. Upload an image
3. Click **"Yes, Generate with AI"**
4. Watch AI analyze and create captions! 🎉

---

## 🐛 Common Issues & Instant Fixes

### ❌ Error 400: "Invalid request"
**Quick Fix**: 
- Use **JPG or PNG** images (not HEIC)
- Keep images **under 4MB**
- Try a different image

### ❌ Error 403: "Invalid API key"
**Quick Fix**:
- Double-check you copied the **full API key**
- Make sure there are **no extra spaces**
- Try **regenerating** the API key

### ❌ "Please add your Gemini API key"
**Quick Fix**:
- You haven't replaced `YOUR_GEMINI_API_KEY_HERE`
- Check line ~367 in `/pages/UploadPage.tsx`

### ❌ Error 429: "Rate limit exceeded"
**Quick Fix**:
- You've used your **15 requests/minute** limit
- Wait **60 seconds**
- Try again

---

## 🎯 What Works Best

### ✅ Recommended Image Formats
- **JPG/JPEG** - ⭐ Best compatibility
- **PNG** - ⭐ Works great
- **GIF** - ✅ Supported
- **WebP** - ✅ Supported
- ❌ **HEIC/HEIF** - Convert to JPG first

### ✅ Recommended Image Sizes
- **Ideal**: 500KB - 2MB
- **Maximum**: 4MB
- **Resolution**: 1080x1080 or smaller

### ✅ Best Types of Images for AI
- Product photos
- Landscapes
- People/portraits
- Graphics with text
- Marketing visuals

---

## 💡 Pro Tips

### Tip 1: Better Captions
The AI analyzes what's **actually in your image**. For best results:
- Use clear, well-lit photos
- Avoid very dark or blurry images
- Include recognizable objects/people

### Tip 2: Customize the AI
Want different caption styles? Edit `/utils/geminiHelper.ts`:
- Line ~58: Change the prompt
- Add your brand voice
- Specify your industry

### Tip 3: Save Money
Free tier includes:
- 15 requests/minute
- 1,500 requests/day
- 1M tokens/month

That's plenty for testing and small projects!

### Tip 4: Production Ready?
For production apps:
1. **Never** put API keys in frontend code
2. Create a **backend API endpoint**
3. Call Gemini from your **server**
4. See full guide in `/GEMINI_API_SETUP.md`

---

## 🔍 Debug Checklist

If something's not working:

- [ ] API key starts with `AIza`
- [ ] No extra spaces around API key
- [ ] Image is JPG or PNG
- [ ] Image is under 4MB
- [ ] Browser console shows no errors (F12)
- [ ] Not hitting rate limits (15/min)
- [ ] Internet connection is stable

---

## 📞 Still Need Help?

1. **Check browser console** (Press F12)
   - Look for error messages
   - Copy the full error text

2. **Test your API key** at [Google AI Studio](https://makersuite.google.com/)
   - Try generating content there
   - If it works there, check your code

3. **Read full docs**: `/GEMINI_API_SETUP.md`

---

## 🎉 Success! What's Next?

Once it's working:
- Try different types of images
- Edit captions manually after AI generation
- Customize hashtags for your brand
- Share on social media platforms!

**Need more features?**
- Custom AI prompts for your industry
- Brand voice customization
- Hashtag analytics
- Multi-language support

Edit `/utils/geminiHelper.ts` to customize! 🚀
