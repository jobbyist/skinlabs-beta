import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { WebStory } from "@shared/schema";
import WebStoriesViewer from "@/components/web-stories-viewer";
import { BannerAd, DisplayAd } from "@/components/ads/adsense-block";
import { AdSlot, ShopifyAffiliateBanner } from "@/components/ads/ad-slot";

// Import attached story assets
import morningEveningStory1 from "@assets/F7BF1DDE-498C-49A2-AEBB-71F6DB1E489A_1756414317148.png";
import sensitiveSkinsStory from "@assets/E4C38E4D-CED8-41FF-ABA0-02515E6CFDC0_1756414317149.png";
import diyMasksStory from "@assets/899F2B40-25C2-4848-8A1B-5E4306C8AC5B_1756414317149.png";
import morningEveningStory2 from "@assets/60E2AA08-8007-4297-9614-58ECED5D03F5_1756414317149.png";

// Sample stories data for demonstration
const sampleStories: WebStory[] = [
  {
    id: "story-1",
    title: "Morning Skincare Routine",
    description: "Start your day with glowing skin",
    category: "routines",
    thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    duration: 25,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-1",
        title: "Good Morning, Beautiful!",
        content: "Let's start your day with a gentle skincare routine that will leave you glowing.",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-2", 
        title: "Step 1: Gentle Cleansing",
        content: "Start with a gentle, pH-balanced cleanser suitable for your skin type.",
        mediaUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-3",
        title: "Step 2: Hydrating Toner", 
        content: "Apply a hydrating toner to prep your skin for the next steps.",
        mediaUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-4",
        title: "Step 3: Vitamin C Serum",
        content: "Brighten your skin with a vitamin C serum for antioxidant protection.",
        mediaUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-5",
        title: "Step 4: Never Forget SPF!",
        content: "Finish with broad-spectrum SPF 30+ sunscreen. Your skin will thank you!",
        mediaUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Shop Sun Protection",
        ctaUrl: "/sponsored-offers"
      }
    ]
  },
  {
    id: "story-2",
    title: "DIY Honey Face Mask",
    description: "Natural glow with ingredients from your kitchen",
    category: "diy",
    thumbnailUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    duration: 20,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-6",
        title: "DIY Honey Glow Mask",
        content: "Create a nourishing face mask with simple kitchen ingredients!",
        mediaUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-7",
        title: "What You'll Need",
        content: "• 2 tbsp raw honey\n• 1 tbsp oatmeal\n• 1 tsp lemon juice",
        mediaUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-8",
        title: "Mix & Apply",
        content: "Combine ingredients, apply to clean face, and relax for 15 minutes.",
        mediaUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-9",
        title: "Glow Time!",
        content: "Rinse with warm water and admire your natural glow!",
        mediaUrl: "https://images.unsplash.com/photo-1594824191513-fa71d965ecf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "More DIY Recipes",
        ctaUrl: "/diy-recipes"
      }
    ]
  },
  {
    id: "story-3",
    title: "Acne Solutions for SA Climate",
    description: "Beat breakouts in humid weather",
    category: "treatments",
    thumbnailUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    duration: 30,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-10",
        title: "Acne in SA Weather",
        content: "Humidity + heat = breakout trouble. Here's how to fight back!",
        mediaUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-11",
        title: "Morning: Oil-Free Cleanse",
        content: "Use a gentle, oil-free cleanser with salicylic acid to control shine.",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-4f6e9d7c1e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-12",
        title: "Spot Treatment Power",
        content: "Apply benzoyl peroxide or tea tree oil to active breakouts only.",
        mediaUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-13",
        title: "Evening: Gentle Exfoliation",
        content: "2-3 times per week, use a gentle chemical exfoliant with BHA.",
        mediaUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-14",
        title: "Hydration is Key",
        content: "Don't skip moisturizer! Use a lightweight, non-comedogenic formula.",
        mediaUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-15",
        title: "Sun Protection Always",
        content: "Acne treatments increase sensitivity. SPF is non-negotiable!",
        mediaUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Acne Treatment Guide",
        ctaUrl: "/skincare-guides"
      }
    ]
  },
  {
    id: "story-4",
    title: "Perfect Skincare Routine Timing",
    description: "Morning vs Evening: When to apply your products",
    category: "routines",
    thumbnailUrl: morningEveningStory1,
    duration: 20,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-16",
        title: "Morning vs Evening Routines",
        content: "Timing matters! Learn when to use your skincare products for maximum effectiveness.",
        mediaUrl: morningEveningStory1,
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-17",
        title: "Morning: Protection Mode",
        content: "Focus on antioxidants (Vitamin C), hydration, and SPF to protect your skin throughout the day.",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-18",
        title: "Evening: Repair Time",
        content: "Night is for repair. Use retinoids, acids, and rich moisturizers while you sleep.",
        mediaUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-19",
        title: "Pro Tips for Timing",
        content: "Wait 15-20 minutes between active ingredients. Your skin needs time to absorb each layer properly.",
        mediaUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Get Routine Guide",
        ctaUrl: "/skincare-guides"
      }
    ]
  },
  {
    id: "story-5",
    title: "Sensitive Skin Solutions",
    description: "Gentle care for reactive skin types",
    category: "sensitive",
    thumbnailUrl: sensitiveSkinsStory,
    duration: 25,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-20",
        title: "Sensitive Skin Care",
        content: "If your skin is easily irritated, these gentle solutions will help you achieve healthy, calm skin.",
        mediaUrl: sensitiveSkinsStory,
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-21",
        title: "Gentle Cleansing First",
        content: "Use a fragrance-free, pH-balanced cleanser. Avoid sulfates and harsh scrubs.",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-4f6e9d7c1e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-22",
        title: "Soothing Ingredients",
        content: "Look for niacinamide, ceramides, hyaluronic acid, and centella asiatica to calm inflammation.",
        mediaUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-23",
        title: "What to Avoid",
        content: "Skip alcohol, essential oils, fragrances, and strong acids until your skin barrier is restored.",
        mediaUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-24",
        title: "Patch Test Everything",
        content: "Always test new products on a small area first. Your sensitive skin will thank you!",
        mediaUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Sensitive Skin Guide",
        ctaUrl: "/skincare-guides"
      }
    ]
  },
  {
    id: "story-6",
    title: "DIY Skincare Masks",
    description: "10 recipes for glowing skin at home",
    category: "diy",
    thumbnailUrl: diyMasksStory,
    duration: 30,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-25",
        title: "DIY Skincare Magic",
        content: "Transform your skin with these 10 easy DIY mask recipes using kitchen ingredients!",
        mediaUrl: diyMasksStory,
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-26",
        title: "Oatmeal Soothing Mask",
        content: "Blend oats + honey + yogurt for sensitive, irritated skin. Apply for 15 minutes.",
        mediaUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-27",
        title: "Brightening Turmeric Mask",
        content: "Mix turmeric + milk + honey for glowing, even-toned skin. Use 2-3 times per week.",
        mediaUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-28",
        title: "Hydrating Avocado Mask",
        content: "Mash avocado + honey + olive oil for dry skin. Rich in vitamins and healthy fats.",
        mediaUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-29",
        title: "Clay Purifying Mask",
        content: "Bentonite clay + apple cider vinegar for oily, acne-prone skin. Use weekly.",
        mediaUrl: "https://images.unsplash.com/photo-1594824191513-fa71d965ecf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-30",
        title: "Get All 10 Recipes!",
        content: "Download our complete DIY mask guide with step-by-step instructions for glowing skin.",
        mediaUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Download Recipe Guide",
        ctaUrl: "/diy-recipes"
      }
    ]
  },
  {
    id: "story-7",
    title: "Morning vs Evening Skincare",
    description: "Perfect your routine timing for maximum results",
    category: "routines",
    thumbnailUrl: morningEveningStory2,
    duration: 22,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-31",
        title: "Skincare Timing Mastery",
        content: "Master the art of morning vs evening skincare for optimal skin health and glow.",
        mediaUrl: morningEveningStory2,
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-32",
        title: "Morning: Light & Protective",
        content: "Keep it simple: cleanser, antioxidant serum, moisturizer, and SPF. Protection is key!",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-33",
        title: "Evening: Deep & Restorative",
        content: "Double cleanse, treatments (retinol/acids), serums, and rich moisturizer for overnight repair.",
        mediaUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-34",
        title: "Common Timing Mistakes",
        content: "Don't use retinol in the morning or Vitamin C at night. Timing these actives wrong can cause irritation!",
        mediaUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Perfect Your Routine",
        ctaUrl: "/skincare-guides"
      }
    ]
  }
];

export default function WebStoriesPage() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // For now, use sample data. In production, you'd fetch from API
  const stories = sampleStories;
  const isLoading = false;

  const handleStoryClick = (storyIndex: number) => {
    setSelectedStoryIndex(storyIndex);
    setIsViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg aspect-[9/16]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Top Banner Ad */}
        <BannerAd className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Web Stories</h1>
          <p className="text-muted-foreground">
            Quick, visual skincare tips and tutorials in story format
          </p>
        </div>
        
        {/* Display Ad before content */}
        <DisplayAd className="mb-6" />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stories.map((story, index) => (
            <Card 
              key={story.id} 
              className="overflow-hidden aspect-[9/16] cursor-pointer hover:shadow-lg transition-all group"
              onClick={() => handleStoryClick(index)}
              data-testid={`card-story-${story.id}`}
            >
              <CardContent className="p-0 relative h-full">
                {story.thumbnailUrl && (
                  <div className="absolute inset-0">
                    <img
                      src={story.thumbnailUrl}
                      alt={story.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4 right-4">
                  <Badge variant="secondary" className="text-xs">
                    {story.category}
                  </Badge>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2" data-testid={`text-story-title-${story.id}`}>
                    {story.title}
                  </h3>
                  {story.duration && (
                    <div className="flex items-center text-xs text-white/80">
                      <Clock className="h-3 w-3 mr-1" />
                      {story.duration}s
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
            <p className="text-muted-foreground">
              Check back soon for engaging skincare stories!
            </p>
          </div>
        )}
        
        {/* Strategic ad placement */}
        <AdSlot variant="between-sections" className="mt-8" />
      </div>

      <WebStoriesViewer
        stories={stories}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        initialStoryIndex={selectedStoryIndex}
      />
    </>
  );
}