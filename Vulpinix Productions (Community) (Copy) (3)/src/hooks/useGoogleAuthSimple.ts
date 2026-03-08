import { useEffect, useState, useCallback } from "react";

// Google OAuth types
interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
  sub: string;
}

interface CredentialResponse {
  credential: string;
  select_by: string;
}

// Decode JWT token from Google
const parseJwt = (token: string): GoogleUser => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export function useGoogleAuthSimple() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (
    response: CredentialResponse,
    onSuccess: (user: GoogleUser) => void,
    onError: (error: string) => void
  ) => {
    try {
      const userInfo = parseJwt(response.credential);
      
      // Verify email is verified by Google
      if (!userInfo.email_verified) {
        onError("Email not verified by Google");
        return;
      }

      onSuccess(userInfo);
    } catch (error) {
      console.error("Token parsing error:", error);
      onError("Failed to authenticate with Google");
    }
  };

  const initializeGoogle = useCallback(
    (
      buttonId: string,
      onSuccess: (user: GoogleUser) => void,
      onError: (error: string) => void
    ) => {
      if (!window.google || !isGoogleLoaded) {
        console.warn("Google Identity Services not loaded");
        return;
      }

      try {
        // Initialize Google Sign-In with custom styling
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
          callback: (response: any) => handleCredentialResponse(response, onSuccess, onError),
          use_fedcm_for_prompt: true,
        });

        // Render the button with custom theme to match dark UI
        window.google.accounts.id.renderButton(
          document.getElementById(buttonId)!,
          {
            theme: "filled_black",           // Dark theme
            size: "large",                    // Large button
            text: "continue_with",            // "Continue with Google" text
            shape: "rectangular",             // Rectangular shape
            logo_alignment: "left",           // Logo on left
            width: 400,                       // Width in pixels (not percentage)
          }
        );

        console.log("Google Sign-In initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
        onError("Failed to initialize Google Sign-In");
      }
    },
    [isGoogleLoaded]
  );

  return {
    isGoogleLoaded,
    initializeGoogle,
  };
}