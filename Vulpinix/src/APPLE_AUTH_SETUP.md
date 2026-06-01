# Apple Sign-In Setup Guide 🍎

This guide will walk you through enabling **real Apple Sign-In & Sign-Up** for both local development and your production Vercel deployment (`https://vulpinix-remix.vercel.app`).

Because Apple requires a paid Apple Developer Account ($99/year) to configure OAuth credentials, you must set up the credentials on the **Apple Developer Portal** first.

---

## 🔧 Setup Guide (Apple Developer Portal)

### **Step 1: Create an App ID**

If you already have an iOS app or a primary App ID for Vulpinix:

1. Go to the [Apple Developer Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list/bundleId) section.
2. Click **`+`** (plus button) next to *Identifiers*.
3. Choose **App IDs**, then click **Continue**.
4. Choose **App**, click **Continue**.
5. Add a description (e.g. "Vulpinix App") and a Bundle ID (e.g. `com.vulpinix.app`).
6. Scroll down to the *Capabilities* list and check **Sign In with Apple**.
7. Click **Continue**, then click **Register**.

---

### **Step 2: Create a Services ID (The OAuth Client ID)**

Apple treats websites as "Services" that link back to your primary App ID. This is where you configure your web credentials.

1. Go back to the [Identifiers List](https://developer.apple.com/account/resources/identifiers/list/bundleId).
2. Click the dropdown on the top right (default is *App IDs*) and select **Services IDs**.
3. Click the **`+`** (plus button) to register a new Services ID.
4. Select **Services IDs**, click **Continue**.
5. Fill in:
   * **Description**: `Vulpinix Web Sign-in`
   * **Identifier (Services ID)**: `com.vulpinix.signin` *(Note: This acts as your **Client ID** in the frontend and backend).*
6. Click **Continue**, then **Register**.

---

### **Step 3: Configure Website Redirects & Domains**

Now you must link your Services ID to your actual website domains.

1. Click on your newly created Services ID (e.g., `com.vulpinix.signin`).
2. Check the **Sign In with Apple** checkbox, then click **Configure** next to it.
3. In the Configuration popup:
   * **Primary App ID**: Select the App ID created in Step 1.
   * **Domains and Subdomains**: Add your Vercel domain and localhost:

     ```text
     vulpinix-remix.vercel.app, localhost
     ```

     *(Note: Do **NOT** include `https://` or `http://` in this field).*
   * **Return URLs (Redirect URIs)**: Add your exact frontend domain and localhost URLs:

     ```text
     https://vulpinix-remix.vercel.app
     http://localhost:3000
     ```

     *(Note: When using `usePopup: true`, Apple still requires the redirect URI to match the parent window's origin exactly).*
4. Click **Next**, then **Done**, then **Continue**, and finally click **Save** (on the top right).

---

## 💻 Environment Variables Configuration

To complete the backend setup, add your Services ID to your backend's environment variables.

### **In Backend `.env` file:**

Add the following line:

```env
APPLE_CLIENT_ID=com.vulpinix.signin
```

*(Replace `com.vulpinix.signin` with the exact Services ID Identifier you registered in Step 2).*

---

## ⚡ How it Works (Under the Hood)

### **1. Script Loading**

We load Apple’s secure JS SDK dynamically inside the frontend:
`https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js`

### **2. Frontend Popup Flow (`AuthPage.tsx`)**

When a user clicks "Continue with Apple", the app opens a secure Apple modal in popup mode (`usePopup: true`). Apple processes the biometric (FaceID/TouchID) or password verification and returns:

* `authorization.id_token` (A signed JWT containing user verification and email).
* `user` (A JSON object containing name details - **returned only on the first login**).

### **3. Backend Verification (`controllers/usercontrollers.js`)**

The backend receives the `id_token`:

1. It validates the cryptographic signature against Apple's official public keys using `apple-signin-auth`.
2. It verifies the audience matches your `APPLE_CLIENT_ID`.
3. It extracts the secure, verified `email` and Apple identifier (`sub`, saved as `appleId`).
4. If a user record does not exist yet, it safely creates one using the provided name details. If a user already exists, it signs them in instantly.

---

## 💡 Important Gotchas (Must Know!)

### 1. **The "First Login Only" Name Behavior**

Apple **only** shares the user's name (`firstName` and `lastName`) on the **very first sign-in/up**.

* During subsequent sign-ins, Apple only returns the identity token (without the `user` block).
* Our backend automatically handles this! If a name is missing on subsequent logins, it pulls it from your existing database record. If a new signup occurs without a name, it generates a clean, capitalized name from their email address (e.g. `john.doe@example.com` ➔ `John Doe`).

### 2. **Testing on `localhost` vs `Production`**

* Apple Sign-In requires secure origins (`https`). While standard desktop browsers allow testing on `http://localhost`, testing on mobile simulators or non-secure networks *must* run on HTTPS (e.g., using `ngrok` or deploying directly to Vercel).
* Production testing on `https://vulpinix-remix.vercel.app` is fully secure and supported!
