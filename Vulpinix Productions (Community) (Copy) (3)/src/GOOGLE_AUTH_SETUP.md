# Google OAuth Setup Guide - Real Account Fetching

## ✅ What's Implemented

Your application now has **real Google OAuth authentication** that fetches actual user data from Google accounts:

### Real Data Fetched from Google:
- ✅ **Full Name** - User's real name from their Google account
- ✅ **Email Address** - Verified email from Google
- ✅ **Profile Picture** - User's Google profile photo
- ✅ **Email Verification Status** - Confirmed by Google
- ✅ **Google ID** - Unique identifier for the user

### How It Works:
1. User clicks "Continue with Google" button
2. Google Sign-In popup appears
3. User selects their Google account
4. Google authenticates and returns a JWT token
5. App decodes the token to extract real user data
6. Data is saved to localStorage:
   ```javascript
   {
     name: "John Doe",              // Real name from Google
     email: "john@gmail.com",       // Verified email
     picture: "https://lh3.googleusercontent.com/...", // Profile pic
     emailVerified: true,           // Verified by Google
     googleId: "1234567890",        // Unique Google ID
     authProvider: "google",
     phone: "",
     company: "",
     location: "",
     website: ""
   }
   ```
7. User is redirected to the upload page

## 🔧 Setup Required (To Enable Real Google OAuth)

### Current Status:
- ⚠️ Using placeholder Client ID
- ⚠️ Google Sign-In button will show but authentication won't work
- ⚠️ Console will show FedCM errors (this is normal without valid Client ID)

### To Enable Real Google Authentication:

#### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name (e.g., "Vulpinix AI Auth")
4. Click "Create"

#### **Step 2: Enable Google Identity Services API**
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Identity Services API"
3. Click on it and click "Enable"

#### **Step 3: Create OAuth 2.0 Client ID**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth Client ID"
3. If prompted, configure OAuth consent screen:
   - Choose "External"
   - Fill in App name: "VULPINIX AI 1.0"
   - Fill in User support email
   - Fill in Developer contact email
   - Click "Save and Continue"
   - Skip scopes (default is fine)
   - Add test users if needed
4. Back to Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Vulpinix Web Client"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     http://localhost:5173
     https://yourdomain.com
     ```
   - **Authorized redirect URIs** (optional):
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
5. Click "Create"
6. **Copy your Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)

#### **Step 4: Update Your Code**

Open `/hooks/useGoogleAuthSimple.ts` and find line 64:

```typescript
// REPLACE THIS:
client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",

// WITH YOUR ACTUAL CLIENT ID:
client_id: "123456789-abc123def456.apps.googleusercontent.com",
```

#### **Step 5: Test Your Integration**
1. Save the file
2. Refresh your app
3. Click "Continue with Google"
4. Select your Google account
5. Grant permissions
6. You should see:
   - Success toast with your name
   - "Email verified by Google: youremail@gmail.com"
   - Redirect to upload page

## 🎯 Expected Behavior

### ✅ With Valid Client ID:
- Google Sign-In button renders properly
- Clicking opens Google account selection popup
- User can select their account
- Real data is fetched and stored
- Success notification appears
- User redirected to upload page
- No FedCM errors in console

### ⚠️ Without Valid Client ID (Current State):
- Google Sign-In button renders
- May show FedCM warnings in console
- Authentication won't complete
- This is **normal for development mode**

## 📊 Real Data Flow

```
User clicks "Continue with Google"
  ↓
Google Sign-In popup appears
  ↓
User authenticates with Google
  ↓
Google returns JWT token containing:
  - name: "John Doe"
  - email: "john@gmail.com"
  - picture: "https://..."
  - email_verified: true
  - sub: "1234567890" (Google ID)
  ↓
App decodes token and extracts data
  ↓
Data saved to localStorage
  ↓
Success notification displayed
  ↓
Navigate to upload page
```

## 🔐 Security Features

### ✅ What's Secure:
- **Email Verification**: Google verifies the email address
- **JWT Token Validation**: Tokens are decoded and validated
- **HTTPS Required**: Production requires HTTPS
- **Unique User IDs**: Each user has a unique Google ID
- **No Password Storage**: No passwords stored for Google users

### ⚠️ Production Best Practices:
1. **Use Environment Variables**:
   ```typescript
   client_id: process.env.VITE_GOOGLE_CLIENT_ID || ""
   ```

2. **Add to `.env.local`**:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

3. **Never commit Client ID** to public repositories

4. **Use HTTPS** in production (required by Google)

5. **Restrict authorized domains** in Google Cloud Console

## 🐛 Troubleshooting

### Issue: "Google Sign-In button not showing"
**Solution**: 
- Check browser console for errors
- Verify Google library is loading
- Wait a few seconds after page load

### Issue: FedCM errors in console
**Solution**: 
- Normal without valid Client ID
- Will disappear once you add your real Client ID
- Doesn't affect other functionality

### Issue: "Origin not allowed"
**Solution**:
- Add your domain to "Authorized JavaScript origins" in Google Cloud Console
- Include the port number for localhost (e.g., `http://localhost:3000`)

### Issue: "Popup blocked"
**Solution**:
- Allow popups for your domain in browser settings
- Or user can manually enable popups

### Issue: Button renders but nothing happens on click
**Solution**:
- You need to add a valid Google Client ID
- Follow Step 3 above to get your Client ID

## 📝 What Gets Stored

After successful Google authentication, localStorage contains:

```javascript
// User Info
{
  "isAuthenticated": "true",
  "authProvider": "google",
  "userInfo": {
    "name": "John Doe",                    // From Google
    "email": "john@gmail.com",             // From Google (verified)
    "picture": "https://lh3.googleusercontent.com/...", // From Google
    "emailVerified": true,                 // From Google
    "googleId": "1234567890",              // From Google (unique ID)
    "phone": "",                           // Can be filled later
    "company": "",                         // Can be filled later
    "location": "",                        // Can be filled later
    "website": ""                          // Can be filled later
  },
  "socialLinks": {
    "instagram": "",
    "facebook": "",
    "youtube": "",
    "twitter": "",
    "linkedin": ""
  }
}
```

## 🚀 Next Steps

1. **Get your Google Client ID** (follow Step 3 above)
2. **Update `/hooks/useGoogleAuthSimple.ts`** with your Client ID
3. **Test the authentication** flow
4. **Deploy to production** with HTTPS
5. **Add your production domain** to authorized origins in Google Cloud Console

## 📚 Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web/guides/overview)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [FedCM Migration Guide](https://developers.google.com/identity/gsi/web/guides/fedcm-migration)

---

**Questions?** The implementation is complete and ready to use. Just add your Google Client ID to enable real authentication! 🎉
