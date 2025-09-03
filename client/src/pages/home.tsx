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
import { AdSlot, ShopifyAffiliateBanner } from "@/components/ads/ad-slot";
import { LazySection } from "@/components/lazy-section";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Search, Crown, WandSparkles, ShoppingBag, Star, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import cashbackImage from "@assets/IMG_3791_1756353075473.jpeg";
import { PollWidget } from "@/components/poll-widget";
import { WebStory } from "@/components/web-story";

// Brand Images
import terresImage from "@assets/thumbnailsquare - 10_1756402415500.png";
import smoochImage from "@assets/thumbnailsquare - 9_1756402415500.png";
import enoughImage from "@assets/thumbnailsquare - 8_1756402415500.png";
import leliveImage from "@assets/thumbnailsquare - 5_1756402415500.png";
import sundaeImage from "@assets/thumbnailsquare - 7_1756402415500.png";
import gloeiImage from "@assets/thumbnailsquare - 6_1756402415500.png";
import yearnskinImage from "@assets/thumbnailsquare - 4_1756402415500.png";
import silkiImage from "@assets/thumbnailsquare - 3_1756402415500.png";
import standardImage from "@assets/thumbnailsquare - 2_1756402415500.png";
import skoonImage from "@assets/thumbnailsquare - 5_1756402547109.png";

// Hero Image
import heroImage from "@assets/skynnhero_1756403170171.png";

// Web Story Images
import storyImage1 from "@assets/037EA6CA-675D-4F71-8669-2B058DF323F1_1756413442879.png";
import storyImage2 from "@assets/EB26ADF9-4E9B-45DC-9A5F-56C3AB913189_1756413442880.png";
import storyImage3 from "@assets/DAE27A1E-7390-4271-B19C-C1F3C955D29B_1756413442880.png";
import storyImage4 from "@assets/533E83A4-FA45-44F2-A1CB-3F3733439C5F_1756413442880.png";
import storyImage5 from "@assets/C2201DB5-9BD6-4C81-AD9A-4CBAE147D3E2_1756413442880.png";
import storyImage6 from "@assets/E702A928-40DF-4601-BCB0-77CE612A4245_1756413878813.png";
import storyImage7 from "@assets/E4E1A636-4DD3-4275-8B34-76CBA5D07679_1756413878813.png";

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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
      <Header />
      <main className="max-w-skynn mx-auto px-4 py-4">
        {/* Hero Section */}
        <section className="mb-6">
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
                  <Button 
                    size="lg" 
                    data-testid="search-button"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        const element = document.getElementById('filtered-results');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
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
                      <Button 
                        onClick={() => setLocation("/skin-quiz")} 
                        size="lg" 
                        variant="outline"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                        data-testid="skin-quiz-button"
                      >
                        <WandSparkles className="w-4 h-4 mr-2" />
                        Take AI Skin Quiz
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
                      <Button 
                        onClick={() => setLocation("/skin-quiz")} 
                        size="lg" 
                        variant="outline"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                        data-testid="skin-quiz-button"
                      >
                        <WandSparkles className="w-4 h-4 mr-2" />
                        Take AI Skin Quiz
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="relative">
                {/* Hero Image - High-quality skincare visual */}
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={heroImage}
                    alt="Diverse group of women with beautiful skin representing inclusive skincare"
                    width={1920}
                    height={320}
                    loading="eager"
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
        <BannerAd className="mb-6" />

        {/* Sponsored Offers */}
        <section className="mb-6">
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
        <section className="mb-6">
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
                { id: "terres-dafrique", name: "TERRES D'AFRIQUE", tagline: "African heritage meets luxury", image: terresImage, description: "Premium African-inspired skincare celebrating natural beauty", url: "https://terresdafrique.com" },
                { id: "smooch", name: "SMOOCH", tagline: "Beauty that makes you smile", image: smoochImage, description: "Award-winning radiance serums and glow-inducing skincare", url: "https://smoochbeauty.com" },
                { id: "enough", name: "ENOUGH.", tagline: "Sustainable beauty redefined", image: enoughImage, description: "Zero-waste skincare from upcycled coffee grounds", url: "https://enough.beauty" },
                { id: "lelive", name: "Lelive Africa", tagline: "Live beautifully", image: leliveImage, description: "Natural African ingredients meet modern science", url: "https://leliveafrica.com" },
                { id: "sundae", name: "Sundae Skin Co.", tagline: "Sweet treats for your skin", image: sundaeImage, description: "Playful, effective skincare that feels like dessert", url: "https://sundaeskin.com" },
                { id: "gloei", name: "Gloei", tagline: "Glow from within", image: gloeiImage, description: "Clean beauty formulations for radiant skin", url: "https://gloei.co.za" },
                { id: "yearnskin", name: "Yearn Skin", tagline: "Your skin's deepest desires", image: yearnskinImage, description: "Luxurious treatments for skin that yearns to glow", url: "https://yearnskin.com" },
                { id: "silki", name: "Silki", tagline: "Smooth as silk", image: silkiImage, description: "Silk-infused skincare for ultimate smoothness", url: "https://silki.co.za" },
                { id: "standard", name: "Standard Beauty", tagline: "Affordable skincare that works™", image: standardImage, description: "Setting the standard for effective, accessible beauty", url: "https://standardbeauty.co.za" },
                { id: "skoon", name: "SKOON. Skincare", tagline: "Clean beauty, conscious living", image: skoonImage, description: "Award-winning sustainable skincare from Cape Town", url: "https://skoonskincare.com" }
              ].map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.id}`}>
                  <div className="bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                </Link>
              ))}
            </AutoCarousel>
          </div>
        </section>

        {/* Mid-page Display Ad */}
        <DisplayAd className="my-6" />

        {/* Search Results */}
        {searchQuery.trim() && (
          <section id="filtered-results" className="mb-6">
            <div className="bg-white dark:bg-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">
                Search Results for "{searchQuery}" ({filteredArticles.length} found)
              </h2>
              {filteredArticles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.slice(0, 6).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles found matching your search.</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Stories */}
            <section className="mb-6">
              <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20 rounded-xl p-4 sm:p-6 mx-2 sm:mx-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Featured Stories</h2>
                  <Badge variant="secondary">New Episodes</Badge>
                </div>
                
                <div className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Watch quick skincare tips and tutorials in our Instagram-style stories
                </div>
                
                <AutoCarousel 
                  autoPlayInterval={7000}
                  itemsPerView={{ mobile: 2, tablet: 3, desktop: 5 }}
                  className="w-full"
                >
                  {[
                    { 
                      id: "story-1", 
                      title: "The Ultimate Playbook", 
                      subtitle: "Everything you need to build your skincare brand from scratch in 2025",
                      image: storyImage1,
                      views: 15234,
                      category: "Playbook",
                      ctaText: "Get the Playbook",
                      ctaLink: "https://gumroad.com/l/skynn-playbook",
                      keywords: ["skincare brand", "business guide", "2025 skincare", "startup"]
                    },
                    { 
                      id: "story-2", 
                      title: "The SKINDEEP Podcast Series", 
                      subtitle: "A deep dive into everything skincare",
                      image: storyImage2,
                      views: 8756,
                      category: "Podcast",
                      ctaText: "Listen Now",
                      ctaLink: "https://spotify.com/show/skindeep-podcast",
                      keywords: ["skincare podcast", "beauty podcast", "skin health", "expert advice"]
                    },
                    { 
                      id: "story-3", 
                      title: "Summer to Fall", 
                      subtitle: "Your skin's seasonal transition survival guide",
                      image: storyImage3,
                      views: 12890,
                      category: "Seasonal",
                      ctaText: "Read Full Guide",
                      ctaLink: "/articles/seasonal-skincare-guide",
                      keywords: ["seasonal skincare", "fall skincare", "skin transition", "weather change"]
                    },
                    { 
                      id: "story-4", 
                      title: "Acne SOS", 
                      subtitle: "Your 30-day clear skin action plan",
                      image: storyImage4,
                      views: 25678,
                      category: "30-Day Plan",
                      ctaText: "Start Your Journey",
                      ctaLink: "/programs/30-day-acne-plan",
                      keywords: ["acne treatment", "clear skin", "30 day challenge", "acne plan"]
                    },
                    { 
                      id: "story-5", 
                      title: "The Busy Professional's 3-Step Glow Routine", 
                      subtitle: "Get glowing skin in just 3 simple steps",
                      image: storyImage5,
                      views: 9345,
                      category: "3-Step Routine",
                      ctaText: "Shop Products",
                      ctaLink: "https://amzn.to/3-step-glow-kit",
                      keywords: ["quick skincare", "professional routine", "glow routine", "3 steps"]
                    },
                    { 
                      id: "story-6", 
                      title: "Anti-Aging Secrets", 
                      subtitle: "Skincare tips for women over 30",
                      image: storyImage6,
                      views: 18923,
                      category: "For Women Over 30",
                      ctaText: "Discover Secrets",
                      ctaLink: "/articles/anti-aging-over-30",
                      keywords: ["anti aging", "over 30 skincare", "wrinkle prevention", "mature skin"]
                    },
                    { 
                      id: "story-7", 
                      title: "Natural vs Chemical", 
                      subtitle: "The great skincare ingredient debate",
                      image: storyImage7,
                      views: 14567,
                      category: "The Great Skincare",
                      ctaText: "Join the Debate",
                      ctaLink: "/community/natural-vs-chemical",
                      keywords: ["natural skincare", "chemical ingredients", "ingredient analysis", "skincare debate"]
                    }
                  ].map((story) => (
                    <WebStory
                      key={story.id}
                      id={story.id}
                      title={story.title}
                      subtitle={story.subtitle}
                      image={story.image}
                      views={story.views}
                      category={story.category}
                      duration={15}
                      ctaText={story.ctaText}
                      ctaLink={story.ctaLink}
                      keywords={story.keywords}
                      publisher="SKYNN"
                      datePublished={new Date().toISOString()}
                    />
                  ))}
                </AutoCarousel>
              </div>
            </section>

            {/* In-feed Advertisement */}
            <AdSlot variant="between-sections" className="my-6" />

            {/* Poll of the Week */}
            <section className="mb-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg mx-auto">
                <PollWidget />
              </div>
            </section>
            
            {/* Shopify Affiliate Banner */}
            <ShopifyAffiliateBanner className="my-6" />
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
            <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20 rounded-xl p-3 mx-3 sm:mx-2 lg:mx-0 lg:p-6 max-w-sm lg:max-w-none">
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
            <div className="aspect-video w-full max-w-2xl mx-auto mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20">
              <img 
                src={cashbackImage}
                alt="SKYNN Cashback Rewards Card - Save on skincare purchases"
                className="w-full h-full object-cover"
              />
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
