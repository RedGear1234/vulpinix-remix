import { createBrowserRouter } from "react-router";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import CreateAdPage from "./pages/CreateAdPage";
import AdPreviewPage from "./pages/AdPreviewPage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import BlogsPage from "./pages/BlogsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AnimatedRoutes,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "auth",
        Component: AuthPage,
      },
      {
        path: "login",
        Component: AuthPage,
      },
      {
        path: "signup",
        Component: AuthPage,
      },
      {
        path: "upload",
        Component: UploadPage,
      },
      {
        path: "create-ad",
        Component: CreateAdPage,
      },
      {
        path: "ad-preview",
        Component: AdPreviewPage,
      },
      {
        path: "payment",
        Component: PaymentPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "terms",
        Component: TermsPage,
      },
      {
        path: "privacy",
        Component: PrivacyPage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
      {
        path: "blogs",
        Component: BlogsPage,
      },
    ],
  },
]);