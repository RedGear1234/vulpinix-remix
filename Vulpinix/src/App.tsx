import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { initAnimations } from './utils/animations';
import { useTheme } from './hooks/useTheme';
import { BackToTop } from './components/BackToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "337485838125-qfsbcv57q8tcabtgtg8shulukt932mr4.apps.googleusercontent.com";

export default function App() {
  // Initialize theme (sets data-theme on <html>, reads from localStorage)
  useTheme();

  useEffect(() => {
    // ── FedCM Permissions Policy ─────────────────────────────────────────
    let metaTag = document.querySelector('meta[http-equiv="Permissions-Policy"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('http-equiv', 'Permissions-Policy');
      metaTag.setAttribute('content', 'identity-credentials-get=(self), browsing-topics=()');
      document.head.appendChild(metaTag);
    }

    // ── Scroll progress bar DOM node ─────────────────────────────────────
    if (!document.getElementById('vx-scroll-progress')) {
      const bar = document.createElement('div');
      bar.id = 'vx-scroll-progress';
      document.body.prepend(bar);
    }

    // ── Custom cursor DOM nodes ───────────────────────────────────────────
    if (!document.getElementById('cursor-dot')) {
      const dot = document.createElement('div');
      dot.id = 'cursor-dot';
      document.body.appendChild(dot);
      const ring = document.createElement('div');
      ring.id = 'cursor-ring';
      document.body.appendChild(ring);
    }

    // ── Global orbs + grid (fixed, behind everything) ─────────────────────
    if (!document.getElementById('vx-global-orbs')) {
      const wrap = document.createElement('div');
      wrap.id = 'vx-global-orbs';
      wrap.innerHTML = `
        <div class="vx-grid-overlay"></div>
        <div class="vx-orb vx-orb-1"></div>
        <div class="vx-orb vx-orb-2"></div>
        <div class="vx-orb vx-orb-3"></div>
      `;
      document.body.prepend(wrap);
    }

    // ── Init animation controller ─────────────────────────────────────────
    const cleanup = initAnimations();
    return () => { cleanup?.(); };
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <BackToTop />
      <Toaster />
    </GoogleOAuthProvider>
  );
}