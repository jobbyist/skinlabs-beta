import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import AIChatbot from "@/components/ai-chatbot";
import { AdSenseScript } from "@/components/google-adsense";
import PWAProvider from "@/components/pwa-provider";
import InstallPrompt from "@/components/mobile/install-prompt";
import MobileNavigation from "@/components/mobile/mobile-navigation";
import MobileHeader from "@/components/mobile/mobile-header";
import OfflineIndicator from "@/components/mobile/offline-indicator";
import LaunchPromotionPopup from "@/components/launch-promotion-popup";
import LaunchBanner from "@/components/mobile/launch-banner";

import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import ProductRecommendations from "@/pages/product-recommendations";
import SkincareGuides from "@/pages/skincare-guides";
import DiyRecipes from "@/pages/diy-recipes";
import WebStories from "@/pages/web-stories";
import CommunityForum from "@/pages/community-forum";
import SponsoredOffers from "@/pages/sponsored-offers";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/product-recommendations" component={ProductRecommendations} />
      <Route path="/skincare-guides" component={SkincareGuides} />
      <Route path="/diy-recipes" component={DiyRecipes} />
      <Route path="/web-stories" component={WebStories} />
      <Route path="/community-forum" component={CommunityForum} />
      <Route path="/sponsored-offers" component={SponsoredOffers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="skynn-theme">
        <AuthProvider>
          <TooltipProvider>
            <PWAProvider />
            <AdSenseScript />
            <Toaster />
            <LaunchBanner />
            <MobileHeader />
            <Router />
            <AIChatbot />
            <InstallPrompt />
            <MobileNavigation />
            <OfflineIndicator />
            <LaunchPromotionPopup />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
