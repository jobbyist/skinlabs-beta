import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

import Header from "@/components/layout/header";
import ArticleCard from "@/components/content/article-card";
import DealCard from "@/components/content/deal-card";
import { AuthModal } from "@/components/auth/auth-modal";
import { ContentGuard } from "@/components/auth/content-guard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Search, Crown, WandSparkles, ShoppingBag, Star, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

import type { Article, Deal } from "@shared/schema";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch articles
  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", { category: selectedCategory === "all" ? undefined : selectedCategory }],
  });

  // Fetch featured articles
  const { data: featuredArticles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });

  // Fetch deals
  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-skynn mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="glass-panel p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Your all-in-one <strong>skincare nexus</strong>
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  The expertly curated & trusted guide to healthy, glowing skin
                </h1>
                <p className="text-muted-foreground mb-6">
                  Derm-informed guides, ingredient explainers, local brand roundups and smarter deals.
                  {!isAuthenticated && (
                    <span className="text-primary font-semibold"> Join to unlock favourites and member tools.</span>
                  )}
                </p>
                
                {/* Search Bar */}
                <div className="flex gap-3 mb-4" role="search" aria-label="Site search">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search guides, ingredients, brands…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="search-input"
                    />
                  </div>
                  <Button size="lg" data-testid="search-button">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["All", "Guides", "Ingredients", "Routines", "Reviews", "Deals", "Local Brands"].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedCategory === filter.toLowerCase().replace(" ", "_") || (filter === "All" && selectedCategory === "all") ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(filter === "All" ? "all" : filter.toLowerCase().replace(" ", "_"))}
                      data-testid={`filter-${filter.toLowerCase()}`}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAuthenticated ? (
                    <>
                      <Button onClick={() => setLocation("/dashboard")} size="lg" data-testid="dashboard-button">
                        <Crown className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Button>
                      {user?.subscriptionStatus === "trial" && (
                        <Button variant="outline" onClick={() => setShowSubscription(true)} size="lg" data-testid="upgrade-button">
                          Upgrade to Premium
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setLocation("/auth")} size="lg" data-testid="signup-button">
                        <Crown className="w-4 h-4 mr-2" />
                        Join Now
                      </Button>
                      <Button variant="outline" onClick={() => setShowOnboarding(true)} size="lg" data-testid="profile-button">
                        <WandSparkles className="w-4 h-4 mr-2" />
                        Complete Skin Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="relative">
                {/* Skincare routine visual */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">☀️</div>
                    <div className="text-sm font-medium">Morning Routine</div>
                    <div className="text-xs text-muted-foreground">Vitamin C + SPF</div>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🌙</div>
                    <div className="text-sm font-medium">Evening Routine</div>
                    <div className="text-xs text-muted-foreground">Retinol + Hydration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsored Offers */}
        {deals.length > 0 && (
          <section className="mb-8">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Sponsored Offers</h2>
                <Button variant="ghost" size="sm">See all</Button>
              </div>
              
              <div className="slide-container">
                <div className="flex gap-4 pb-2">
                  {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Content */}
            {featuredArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recommended for You</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  {isAuthenticated ? "Based on your skin profile and reading history" : "Popular content from our community"}
                </div>
                
                <div className="slide-container">
                  <div className="flex gap-4 pb-2">
                    {featuredArticles.slice(0, 6).map((article) => (
                      <div key={article.id} className="flex-none w-80">
                        <ArticleCard article={article} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Latest Articles */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Latest Curations</h2>
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40" data-testid="category-select">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="guides">Guides</SelectItem>
                      <SelectItem value="ingredients">Ingredients</SelectItem>
                      <SelectItem value="routines">Routines</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="deals">Deals</SelectItem>
                      <SelectItem value="local_brands">Local Brands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {articlesLoading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-panel p-4 animate-pulse">
                      <div className="w-full h-32 bg-muted rounded-lg mb-3" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 text-center">
                  <div className="text-muted-foreground mb-2">No articles found</div>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms" : "No articles available in this category"}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Status */}
            {isAuthenticated && user && (
              <div className="glass-panel p-6">
                <h3 className="font-bold mb-4">Your Progress</h3>
                
                <div className="space-y-4">
                  {/* Subscription Status */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {user.subscriptionStatus === "free_lifetime" ? "Free Lifetime" : 
                         user.subscriptionStatus === "trial" ? "Premium Trial" : 
                         user.subscriptionStatus === "active" ? "Premium" : "Free"}
                      </span>
                      {user.subscriptionStatus === "trial" && user.trialEndDate && (
                        <span className="text-xs text-primary">
                          {Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      )}
                    </div>
                    
                    {user.subscriptionStatus === "trial" && (
                      <>
                        <div className="w-full bg-muted/20 rounded-full h-2 mb-2">
                          <div className="progress-bar h-2 rounded-full" style={{ width: "50%" }} />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowAuthModal(true)}
                          data-testid="upgrade-subscription"
                        >
                          Upgrade to Premium
                        </Button>
                      </>
                    )}
                    
                    {user.isFoundingMember && (
                      <Badge variant="secondary" className="mt-2">
                        🎉 Founding Member
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass-panel p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setShowAuthModal(true)}
                  data-testid="skynn-ai"
                >
                  <WandSparkles className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">SKYNN AI</div>
                    <div className="text-xs text-muted-foreground">Get personalized advice</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="routine-builder">
                  <div className="w-4 h-4 mr-3 text-secondary">📅</div>
                  <div className="text-left">
                    <div className="text-sm font-medium">Routine Builder</div>
                    <div className="text-xs text-muted-foreground">Create custom routine</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="deals-offers">
                  <ShoppingBag className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Deals & Offers</div>
                    <div className="text-xs text-muted-foreground">Exclusive member deals</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Member Deals */}
            {deals.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="font-bold mb-4">Member Deals</h3>
                <div className="space-y-3">
                  {deals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="deal-card p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{deal.brand}</span>
                        {deal.discountPercentage && (
                          <Badge variant="default" className="text-xs">
                            {deal.discountPercentage}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{deal.description}</div>
                      <div className="flex items-center justify-between">
                        {deal.code && (
                          <span className="text-xs text-primary font-medium">Code: {deal.code}</span>
                        )}
                        <Button size="sm" variant="ghost" className="text-xs p-1 h-auto" asChild>
                          <a href={deal.url} target="_blank" rel="noopener" data-testid={`deal-shop-${deal.id}`}>
                            Shop →
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}
