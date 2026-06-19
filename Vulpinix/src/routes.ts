import { createBrowserRouter } from "react-router";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import AIAgentPage from "./pages/AIAgentPage";
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
import UserDashboard from "./pages/UserDashboard";
import CampaignsDashboardPage from "./pages/CampaignsDashboardPage";
import CampaignAnalyticsPage from "./pages/CampaignAnalyticsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CookiePage from "./pages/CookiePage";
import NotFoundPage from "./pages/NotFoundPage";
import CreatePostPage from "./pages/CreatePostPage";
import SocialAccountsPage from "./pages/SocialAccountsPage";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";
import ScheduledPostsPage from "./pages/ScheduledPostsPage";
import FeedbackPage from "./pages/FeedbackPage";
import DataDeletionPage from "./pages/DataDeletionPage";
import InstagramInsightsPage from "./pages/InstagramInsightsPage";
import EngagementDashboardPage from "./pages/EngagementDashboardPage";
import HashtagTrackingPage from "./pages/HashtagTrackingPage";

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
        path: "onboarding",
        Component: OnboardingPage,
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
        path: "data-deletion",
        Component: DataDeletionPage,
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
        path: "dashboard",
        Component: UserDashboard,
      },
      {
        path: "dashboard/scheduled",
        Component: ScheduledPostsPage,
      },
      {
        path: "dashboard/ai",
        Component: AIAgentPage,
      },
      {
        path: "create-post",
        Component: CreatePostPage,
      },
      {
        path: "social",
        Component: SocialAccountsPage,
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
        path: "dashboard/instagram",
        Component: InstagramInsightsPage,
      },
      {
        path: "dashboard/hashtags",
        Component: HashtagTrackingPage,
      },
      {
        path: "dashboard/engagement",
        Component: EngagementDashboardPage,
      },

      {
        path: "settings",
        Component: SettingsPage,
      },
      {
        path: "settings/:tab",
        Component: SettingsPage,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
      {
        path: "feedback",
        Component: FeedbackPage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);