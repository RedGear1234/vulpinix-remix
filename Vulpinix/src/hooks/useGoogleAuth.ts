import { useEffect, useState } from "react";

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
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export function useGoogleAuth() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

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
      // Cleanup: remove script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleSignIn = (
    onSuccess: (user: GoogleUser) => void,
    onError: (error: string) => void
  ) => {
    if (!isGoogleLoaded || !(window as any).google) {
      onError("Google Sign-In is not loaded yet");
      return;
    }

    try {
      // Initialize Google Sign-In with FedCM support
      (window as any).google.accounts.id.initialize({
        // Using a demo client ID - In production, replace with your own Client ID
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: (response: CredentialResponse) => {
          try {
            const userInfo = parseJwt(response.credential);
            
            // Verify email is verified by Google
            if (!userInfo.email_verified) {
              onError("Email not verified by Google");
              return;
            }

            onSuccess(userInfo);
          } catch (error) {
            onError("Failed to authenticate with Google");
          }
        },
        // FedCM compatibility options
        use_fedcm_for_prompt: true,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signin",
      });
    } catch (error) {
      console.error("Google Sign-In initialization error:", error);
      onError("Failed to initialize Google Sign-In");
    }
  };

  const signInWithGoogle = (
    onSuccess: (user: GoogleUser) => void,
    onError: (error: string) => void
  ) => {
    if (!isGoogleLoaded || !(window as any).google) {
      onError("Google Sign-In is not loaded yet");
      return;
    }

    try {
      // Initialize first
      initializeGoogleSignIn(onSuccess, onError);

      // Trigger the Google Sign-In popup using renderButton method
      // This is more FedCM-compatible than using prompt()
      const buttonDiv = document.createElement('div');
      buttonDiv.id = 'g_id_signin_button_temp';
      buttonDiv.style.display = 'none';
      document.body.appendChild(buttonDiv);

      (window as any).google.accounts.id.renderButton(buttonDiv, {
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
      });

      // Programmatically click the button
      setTimeout(() => {
        const button = buttonDiv.querySelector('div[role="button"]') as HTMLElement;
        if (button) {
          button.click();
        }
        // Cleanup
        setTimeout(() => {
          if (document.body.contains(buttonDiv)) {
            document.body.removeChild(buttonDiv);
          }
        }, 100);
      }, 100);
    } catch (error) {
      console.error("Google Sign-In error:", error);
      onError("Failed to trigger Google Sign-In");
    }
  };

  const renderGoogleButton = (
    elementId: string,
    onSuccess: (user: GoogleUser) => void,
    onError: (error: string) => void
  ) => {
    if (!isGoogleLoaded || !(window as any).google) {
      return;
    }

    try {
      // Initialize first
      initializeGoogleSignIn(onSuccess, onError);

      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return;
      }

      // Render the Google Sign-In button
      (window as any).google.accounts.id.renderButton(element, {
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
        width: 350,
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    } catch (error) {
      console.error("Google button render error:", error);
    }
  };

  return {
    isGoogleLoaded,
    signInWithGoogle,
    renderGoogleButton,
  };
}