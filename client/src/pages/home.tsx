import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { Link, useLocation } from "wouter";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ArticleCard from "@/components/content/article-card";
import DealCard from "@/components/content/deal-card";
import { AuthModal } from "@/components/auth/auth-modal";
import { WaitingListModal } from "@/components/waiting-list-modal";
import { ContentGuard } from "@/components/auth/content-guard";
import { AutoCarousel } from "@/components/ui/auto-carousel";
import { BannerAd, DisplayAd, InArticleAd } from "@/components/ads/adsense-block";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Search, Crown, WandSparkles, ShoppingBag, Star, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import cashbackVideo from "@assets/gemini_generated_video_A5F38BC6_1756339733830.mov";
import { PollWidget } from "@/components/poll-widget";

import type { Article, Deal } from "@shared/schema";

export default function Home() {
  const { user, isSignedIn: isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWaitingListModal, setShowWaitingListModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch articles
  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: selectedCategory === "all" 
      ? ["/api/articles"]
      : [`/api/articles?category=${selectedCategory}`],
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
          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-background dark:to-purple-950/20 rounded-xl p-6">
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
                        <Button variant="outline" onClick={() => setShowAuthModal(true)} size="lg" data-testid="upgrade-button">
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
                      <Button variant="outline" onClick={() => setShowAuthModal(true)} size="lg" data-testid="profile-button">
                        <WandSparkles className="w-4 h-4 mr-2" />
                        Complete Skin Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="relative">
                {/* Hero Image - High-quality skincare visual */}
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Beautiful woman applying skincare products with glowing healthy skin"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating elements */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="text-xl mb-1">☀️</div>
                        <div className="text-xs font-medium text-white">Morning Routine</div>
                        <div className="text-xs text-white/80">Vitamin C + SPF</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="text-xl mb-1">🌙</div>
                        <div className="text-xs font-medium text-white">Evening Routine</div>
                        <div className="text-xs text-white/80">Retinol + Hydration</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Banner Advertisement */}
        <BannerAd className="mb-8" />

        {/* Sponsored Offers */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Sponsored Offers</h2>
              <Badge variant="secondary">Limited Time</Badge>
            </div>
            
            <AutoCarousel 
              autoPlayInterval={5000}
              itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
              className="w-full"
            >
              {[
                { id: "offer-1", brand: "CeraVe", discount: 30, title: "Hydrating Cleanser", description: "Gentle daily face wash with ceramides", price: "R189", originalPrice: "R270" },
                { id: "offer-2", brand: "Eucerin", discount: 25, title: "Sun Protection SPF 50", description: "Advanced UVA/UVB protection for face", price: "R225", originalPrice: "R300" },
                { id: "offer-3", brand: "Cetaphil", discount: 40, title: "Daily Moisturizer", description: "Lightweight non-comedogenic formula", price: "R150", originalPrice: "R250" },
                { id: "offer-4", brand: "La Roche-Posay", discount: 20, title: "Effaclar Duo", description: "Anti-acne treatment cream", price: "R320", originalPrice: "R400" },
                { id: "offer-5", brand: "Neutrogena", discount: 35, title: "Hydro Boost Gel", description: "Water gel with hyaluronic acid", price: "R195", originalPrice: "R300" },
                { id: "offer-6", brand: "Nivea", discount: 50, title: "Q10 Anti-Wrinkle", description: "Anti-aging night cream", price: "R125", originalPrice: "R250" },
                { id: "offer-7", brand: "The Ordinary", discount: 15, title: "Niacinamide 10%", description: "Zinc 1% serum for blemishes", price: "R170", originalPrice: "R200" },
                { id: "offer-8", brand: "Vichy", discount: 30, title: "Mineral 89", description: "Daily booster with thermal water", price: "R350", originalPrice: "R500" },
                { id: "offer-9", brand: "Bioderma", discount: 25, title: "Sensibio Micellar", description: "Sensitive skin makeup remover", price: "R225", originalPrice: "R300" },
                { id: "offer-10", brand: "Avene", discount: 20, title: "Thermal Spring Water", description: "Soothing and anti-irritating spray", price: "R160", originalPrice: "R200" }
              ].map((offer) => (
                <div key={offer.id} className="bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{offer.discount}%</div>
                      <div className="text-sm text-muted-foreground">OFF</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mb-2 text-xs">{offer.brand}</Badge>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{offer.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-primary">{offer.price}</div>
                      <div className="text-xs text-muted-foreground line-through">{offer.originalPrice}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingBag className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </AutoCarousel>
          </div>
        </section>

        {/* Brand Spotlight */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-amber-950/20 dark:via-background dark:to-yellow-950/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Brand Spotlight</h2>
              <Badge variant="secondary">🇿🇦 Local Brands</Badge>
            </div>
            
            <div className="text-sm text-muted-foreground mb-4">
              South African skincare brands making waves in the beauty industry
            </div>
            
            <AutoCarousel 
              autoPlayInterval={5000}
              itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              className="w-full"
            >
              {[
                { id: "brand-1", name: "SKOON Skincare", tagline: "Clean beauty, conscious living", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400", description: "Award-winning sustainable skincare from Cape Town" },
                { id: "brand-2", name: "Standard Beauty", tagline: "Setting new standards", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400", description: "Premium African botanicals for modern skincare" },
                { id: "brand-3", name: "Lumi Glo", tagline: "Your glow, amplified", image: "https://images.unsplash.com/photo-1620756235108-7d8d27d7ca43?w=400", description: "Science-backed formulations for melanin-rich skin" },
                { id: "brand-4", name: "Beauty on TApp", tagline: "Beauty at your fingertips", image: "https://images.unsplash.com/photo-1556228852-80b2b6411f08?w=400", description: "Digital-first beauty brand revolutionizing access" },
                { id: "brand-5", name: "Lelive", tagline: "Live beautifully", image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400", description: "Natural African ingredients meet modern science" },
                { id: "brand-6", name: "African Botanics", tagline: "Luxury from Africa", image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400", description: "Ultra-luxury skincare with African heritage" },
                { id: "brand-7", name: "Africology", tagline: "Naturally African", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400", description: "Spa-quality products inspired by African wellness" },
                { id: "brand-8", name: "Kuro", tagline: "Bold beauty", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", description: "Innovative formulas for the modern African woman" },
                { id: "brand-9", name: "Suki Suki Naturals", tagline: "Nature's touch", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", description: "100% natural ingredients sourced locally" },
                { id: "brand-10", name: "Zuri", tagline: "Beautiful in every shade", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400", description: "Inclusive beauty celebrating African diversity" }
              ].map((brand) => (
                <div key={brand.id} className="bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{brand.name}</h3>
                    <p className="text-xs text-primary mb-2">{brand.tagline}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{brand.description}</p>
                    <Button variant="ghost" size="sm" className="mt-3 w-full">
                      Explore Brand →
                    </Button>
                  </div>
                </div>
              ))}
            </AutoCarousel>
          </div>
        </section>

        {/* Mid-page Display Ad */}
        <DisplayAd className="my-8" />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Content */}
            <section className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recommended for You</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  {isAuthenticated ? "Based on your skin profile and reading history" : "Popular content from our community"}
                </div>
                
                <AutoCarousel 
                  autoPlayInterval={5000}
                  itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                  className="w-full"
                >
                  {[
                    { id: "rec-1", title: "Morning Skincare Routine", category: "Guides", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", description: "Start your day with the perfect morning routine" },
                    { id: "rec-2", title: "Understanding Retinol", category: "Ingredients", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38e39?w=400", description: "Everything you need to know about retinol usage" },
                    { id: "rec-3", title: "Best SPF for Dark Skin", category: "Reviews", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400", description: "Top sunscreens that don't leave white cast" },
                    { id: "rec-4", title: "Acne Treatment Guide", category: "Guides", image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400", description: "Complete guide to treating different types of acne" },
                    { id: "rec-5", title: "Vitamin C Benefits", category: "Ingredients", image: "https://images.unsplash.com/photo-1609097162027-cd6dba5accef?w=400", description: "How Vitamin C brightens and protects your skin" },
                    { id: "rec-6", title: "Winter Skin Care", category: "Seasonal", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400", description: "Keep your skin hydrated during cold months" },
                    { id: "rec-7", title: "K-Beauty Essentials", category: "Trends", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400", description: "Must-have products from Korean skincare" },
                    { id: "rec-8", title: "Natural Ingredients", category: "Natural", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400", description: "Powerful natural ingredients for your skin" }
                  ].map((item) => (
                    <div key={item.id} className="bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">{item.category}</Badge>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{item.description}</p>
                        <Button variant="ghost" size="sm" className="mt-3 w-full">
                          Read More →
                        </Button>
                      </div>
                    </div>
                  ))}
                </AutoCarousel>
              </div>
            </section>

            {/* In-feed Advertisement */}
            <InArticleAd className="my-6" />

            {/* Poll of the Week */}
            <section className="mb-8">
              <PollWidget />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Status */}
            {isAuthenticated && user && (
              <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20 rounded-xl p-4 lg:p-6">
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
            <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20 rounded-xl p-3 mx-2 lg:mx-0 lg:p-6">
              <h3 className="font-bold mb-3 text-center lg:text-left text-sm lg:text-base">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start px-2 py-1.5 h-auto text-xs lg:text-sm lg:px-3 lg:py-2" 
                  onClick={() => setShowAuthModal(true)}
                  data-testid="skynn-ai"
                >
                  <WandSparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-2 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="font-medium text-xs lg:text-sm">SKYNN AI</div>
                    <div className="text-[10px] lg:text-xs text-muted-foreground">Personalized advice</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start px-2 py-1.5 h-auto text-xs lg:text-sm lg:px-3 lg:py-2" data-testid="routine-builder">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 mr-2 text-secondary flex-shrink-0">📅</div>
                  <div className="text-left min-w-0">
                    <div className="font-medium text-xs lg:text-sm">Routine Builder</div>
                    <div className="text-[10px] lg:text-xs text-muted-foreground">Custom routine</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start px-2 py-1.5 h-auto text-xs lg:text-sm lg:px-3 lg:py-2" data-testid="deals-offers">
                  <ShoppingBag className="w-3 h-3 lg:w-4 lg:h-4 mr-2 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="font-medium text-xs lg:text-sm">Deals & Offers</div>
                    <div className="text-[10px] lg:text-xs text-muted-foreground">Member deals</div>
                  </div>
                </Button>
              </div>
            </div>


          </div>
        </div>
        {/* Cashback Rewards Card Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-yellow-950/20 dark:via-background dark:to-amber-950/20 rounded-xl p-6">
            <div className="text-center mb-4">
              <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
              <h2 className="text-2xl font-bold mb-2">SKYNN Cashback Rewards Card</h2>
              <p className="text-muted-foreground">Premium members exclusive - Launching December 2024</p>
            </div>
            
            {/* Video Container */}
            <div className="aspect-video w-full max-w-2xl mx-auto mb-6 rounded-lg overflow-hidden bg-black">
              <video 
                className="w-full h-full object-cover"
                controls
                poster="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800"
              >
                <source src={cashbackVideo} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600"
                onClick={() => setShowWaitingListModal(true)}
                data-testid="button-join-waiting-list"
              >
                <Star className="mr-2 h-5 w-5" />
                Join The Waiting List
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Be the first to know when we launch</p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
      
      {/* Waiting List Modal */}
      {showWaitingListModal && (
        <WaitingListModal 
          isOpen={showWaitingListModal} 
          onClose={() => setShowWaitingListModal(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
}
