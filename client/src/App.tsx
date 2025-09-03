import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
<<<<<<< HEAD
import { AuthProvider } from "@/hooks/use-auth";
=======
import { ClerkProvider } from "@clerk/clerk-react";
import AIChatbot from "@/components/ai-chatbot";
>>>>>>> 1976a5a3ba3e88223d15646a99b28f4bf05caa2c
import PWAProvider from "@/components/pwa-provider";
import InstallPrompt from "@/components/mobile/install-prompt";
import MobileNavigation from "@/components/mobile/mobile-navigation";
import MobileHeader from "@/components/mobile/mobile-header";
import OfflineIndicator from "@/components/mobile/offline-indicator";
import LaunchPromotionPopup from "@/components/launch-promotion-popup";
import LaunchBanner from "@/components/mobile/launch-banner";
import CookieConsent from "@/components/cookie-consent";
import { useAdInjection } from "@/hooks/use-ad-injection";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import ProductRecommendations from "@/pages/product-recommendations";
import SkincareGuides from "@/pages/skincare-guides";
import DiyRecipes from "@/pages/diy-recipes";
import WebStories from "@/pages/web-stories";
import CommunityForum from "@/pages/community-forum";
import SponsoredOffers from "@/pages/sponsored-offers";
import Streams from "@/pages/streams";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import CookiePolicy from "@/pages/cookie-policy";
import Advertise from "@/pages/advertise";
import Chatbot from "@/pages/chatbot";
import SkinQuiz from "@/pages/skin-quiz";

// Brand Pages
import TerresDAfrique from "@/pages/brands/terres-dafrique";
import Smooch from "@/pages/brands/smooch";
import Enough from "@/pages/brands/enough";
import Lelive from "@/pages/brands/lelive";
import Sundae from "@/pages/brands/sundae";
import Gloei from "@/pages/brands/gloei";
import YearnSkin from "@/pages/brands/yearnskin";
import Silki from "@/pages/brands/silki";
import Standard from "@/pages/brands/standard";
import Skoon from "@/pages/brands/skoon";

function Router() {
  // Auto-inject ads between sections
  useAdInjection();
  
  // Scroll to top on route changes
  useScrollToTop();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/product-recommendations" component={ProductRecommendations} />
      <Route path="/skincare-guides" component={SkincareGuides} />
      <Route path="/diy-recipes" component={DiyRecipes} />
      <Route path="/web-stories" component={WebStories} />
      <Route path="/community-forum" component={CommunityForum} />
      <Route path="/sponsored-offers" component={SponsoredOffers} />
      <Route path="/streams" component={Streams} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/advertise" component={Advertise} />
      <Route path="/chatbot" component={Chatbot} />
      <Route path="/skin-quiz" component={SkinQuiz} />
      
      {/* Brand Pages */}
      <Route path="/brands/terres-dafrique" component={TerresDAfrique} />
      <Route path="/brands/smooch" component={Smooch} />
      <Route path="/brands/enough" component={Enough} />
      <Route path="/brands/lelive" component={Lelive} />
      <Route path="/brands/sundae" component={Sundae} />
      <Route path="/brands/gloei" component={Gloei} />
      <Route path="/brands/yearnskin" component={YearnSkin} />
      <Route path="/brands/silki" component={Silki} />
      <Route path="/brands/standard" component={Standard} />
      <Route path="/brands/skoon" component={Skoon} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(262.1 83.3% 57.8%)",
          colorBackground: "hsl(224 71.4% 4.1%)",
          colorInputBackground: "hsl(220 13% 9%)",
          colorInputText: "hsl(210 40% 98%)",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="skynn-theme">
          <TooltipProvider>
            <PWAProvider />
            <Toaster />
            <LaunchBanner />
            <MobileHeader />
            <Router />
            <InstallPrompt />
            <MobileNavigation />
            <OfflineIndicator />
            <LaunchPromotionPopup />
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
