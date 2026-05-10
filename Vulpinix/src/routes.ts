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
import ArticlePage from "./pages/ArticlePage";
import CampaignsDashboardPage from "./pages/CampaignsDashboardPage";
import CampaignAnalyticsPage from "./pages/CampaignAnalyticsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CookiePage from "./pages/CookiePage";
import NotFoundPage from "./pages/NotFoundPage";

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
        path: "cookies",
        Component: CookiePage,
      },
      {
        path: "blogs",
        Component: BlogsPage,
      },
      {
        path: "blogs/:id",
        Component: ArticlePage,
      },
      {
        path: "dashboard/campaigns",
        Component: CampaignsDashboardPage,
      },
      {
        path: "dashboard/campaigns/:id/analytics",
        Component: CampaignAnalyticsPage,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);