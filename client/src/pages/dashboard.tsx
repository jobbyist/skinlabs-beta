import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useLocation } from "wouter";

import Header from "@/components/layout/header";
import ArticleCard from "@/components/content/article-card";
import OnboardingModal from "@/components/auth/onboarding-modal";
import SubscriptionModal from "@/components/auth/subscription-modal";
import { DisplayAd } from "@/components/ads/adsense-block";
// import { AdSlot, ShopifyAffiliateBanner } from "@/components/ads/ad-slot"; // Temporarily disabled

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Crown, WandSparkles, Calendar, ShoppingBag, Heart, Settings, BookOpen, Target, TrendingUp } from "lucide-react";

import type { Article, UserSkinProfile } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    setLocation("/auth");
    return null;
  }

  // Fetch user's skin profile
  const { data: skinProfile } = useQuery<UserSkinProfile | null>({
    queryKey: ["/api/user/skin-profile"],
  });

  // Fetch saved articles
  const { data: savedArticles = [] } = useQuery<Article[]>({
    queryKey: ["/api/user/saved-articles"],
  });

  // Fetch recommended articles
  const { data: recommendedArticles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });

  const getSubscriptionStatusDisplay = () => {
    switch (user.subscriptionStatus) {
      case "free_lifetime":
        return { text: "Free Lifetime", color: "text-green-400", badge: "🎉 Founding Member" };
      case "trial":
        return { text: "Premium Trial", color: "text-blue-400", badge: null };
      case "active":
        return { text: "Premium", color: "text-primary", badge: "Premium" };
      default:
        return { text: "Free", color: "text-muted-foreground", badge: null };
    }
  };

  const subscriptionStatus = getSubscriptionStatusDisplay();
  const trialDaysLeft = user.trialEndDate 
    ? Math.max(0, Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-skynn mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${subscriptionStatus.color}`}>
                  {subscriptionStatus.text}
                </div>
                {subscriptionStatus.badge && (
                  <Badge variant="secondary" className="mt-1">
                    {subscriptionStatus.badge}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Progress Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Subscription Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Subscription</span>
                  {user.subscriptionStatus === "trial" && (
                    <span className="text-primary">{trialDaysLeft} days left</span>
                  )}
                </div>
                {user.subscriptionStatus === "trial" && (
                  <>
                    <Progress value={((14 - trialDaysLeft) / 14) * 100} className="h-2" />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowSubscription(true)}
                      data-testid="upgrade-trial"
                    >
                      Upgrade to Premium
                    </Button>
                  </>
                )}
              </div>
              
              {/* Skin Profile Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Skin Profile</span>
                  <span className="text-yellow-400">{skinProfile?.completionPercentage || 0}%</span>
                </div>
                <Progress value={skinProfile?.completionPercentage || 0} className="h-2" />
                {(skinProfile?.completionPercentage || 0) < 100 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowOnboarding(true)}
                    data-testid="complete-profile"
                  >
                    Complete Profile
                  </Button>
                )}
              </div>
              
              {/* Reading Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Articles Saved</span>
                  <span className="text-secondary">{savedArticles.length}</span>
                </div>
                <Progress value={Math.min((savedArticles.length / 10) * 100, 100)} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Goal: Save 10 articles
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic ad placement between sections */}
        {/* AdSlot placeholder */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="recommended" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recommended" data-testid="tab-recommended">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  For You
                </TabsTrigger>
                <TabsTrigger value="saved" data-testid="tab-saved">
                  <Heart className="w-4 h-4 mr-2" />
                  Saved ({savedArticles.length})
                </TabsTrigger>
                <TabsTrigger value="profile" data-testid="tab-profile">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommended" className="space-y-6">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                  {skinProfile && (
                    <div className="text-sm text-muted-foreground mb-4">
                      Based on your skin profile: 
                      <span className="text-foreground font-medium ml-1">
                        {skinProfile.skinType && `${skinProfile.skinType} skin`}
                        {skinProfile.skinConcerns && skinProfile.skinConcerns.length > 0 && 
                          `, ${skinProfile.skinConcerns.join(', ')} concerns`
                        }
                      </span>
                    </div>
                  )}
                  
                  {recommendedArticles.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {recommendedArticles.slice(0, 6).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No recommendations yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete your skin profile to get personalized content recommendations
                      </p>
                      <Button onClick={() => setShowOnboarding(true)} data-testid="setup-recommendations">
                        <WandSparkles className="w-4 h-4 mr-2" />
                        Complete Profile
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="space-y-6">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-bold mb-4">Saved Articles</h2>
                  
                  {savedArticles.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {savedArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No saved articles yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Save articles while browsing to access them later
                      </p>
                      <Button onClick={() => setLocation("/")} data-testid="browse-articles">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse Articles
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Affiliate banner in saved tab */}
                {/* ShopifyAffiliateBanner placeholder */}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-bold mb-4">Skin Profile</h2>
                  
                  {skinProfile ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {skinProfile.skinType && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Skin Type</h4>
                            <p className="text-sm text-muted-foreground capitalize">{skinProfile.skinType}</p>
                          </div>
                        )}
                        
                        {skinProfile.fitzpatrickScale && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Fitzpatrick Scale</h4>
                            <p className="text-sm text-muted-foreground">Type {skinProfile.fitzpatrickScale}</p>
                          </div>
                        )}
                        
                        {skinProfile.monthlyBudget && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Monthly Budget</h4>
                            <p className="text-sm text-muted-foreground">R{skinProfile.monthlyBudget}</p>
                          </div>
                        )}
                        
                        {skinProfile.routinePreference && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Routine Preference</h4>
                            <p className="text-sm text-muted-foreground capitalize">{skinProfile.routinePreference}</p>
                          </div>
                        )}
                      </div>
                      
                      {skinProfile.skinConcerns && skinProfile.skinConcerns.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Skin Concerns</h4>
                          <div className="flex flex-wrap gap-2">
                            {skinProfile.skinConcerns.map((concern) => (
                              <Badge key={concern} variant="secondary">{concern}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {skinProfile.skinGoals && skinProfile.skinGoals.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Skin Goals</h4>
                          <div className="flex flex-wrap gap-2">
                            {skinProfile.skinGoals.map((goal) => (
                              <Badge key={goal} variant="outline">{goal}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setShowOnboarding(true)}
                        data-testid="edit-profile"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Set up your skin profile</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tell us about your skin to get personalized recommendations
                      </p>
                      <Button onClick={() => setShowOnboarding(true)} data-testid="create-profile">
                        <WandSparkles className="w-4 h-4 mr-2" />
                        Create Profile
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-panel p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="ai-assistant"
                >
                  <WandSparkles className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">SKYNN AI</div>
                    <div className="text-xs text-muted-foreground">
                      {user.subscriptionStatus === "free_lifetime" || user.subscriptionStatus === "active" 
                        ? "Get personalized advice" 
                        : "Premium feature"
                      }
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="routine-builder">
                  <Calendar className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Routine Builder</div>
                    <div className="text-xs text-muted-foreground">Create custom routine</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="exclusive-deals">
                  <ShoppingBag className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Exclusive Deals</div>
                    <div className="text-xs text-muted-foreground">Member-only offers</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="glass-panel p-6">
              <h3 className="font-bold mb-4">Account</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={subscriptionStatus.color}>{subscriptionStatus.text}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{new Date(user.signupDate || Date.now()).toLocaleDateString()}</span>
                </div>
                
                {user.subscriptionStatus === "trial" && (
                  <div className="pt-3 border-t">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => setShowSubscription(true)}
                      data-testid="upgrade-premium"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
      
      <SubscriptionModal 
        isOpen={showSubscription} 
        onClose={() => setShowSubscription(false)} 
      />
    </div>
  );
}
