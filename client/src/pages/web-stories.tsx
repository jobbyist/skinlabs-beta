import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { WebStory } from "@shared/schema";
import WebStoriesViewer from "@/components/web-stories-viewer";

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
    title: "Anti-Aging Routine After 30",
    description: "Prevent and treat signs of aging",
    category: "anti-aging",
    thumbnailUrl: "https://images.unsplash.com/photo-1594824191513-fa71d965ecf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    duration: 35,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-16",
        title: "Anti-Aging After 30",
        content: "Prevention is better than cure. Start your anti-aging journey now!",
        mediaUrl: "https://images.unsplash.com/photo-1594824191513-fa71d965ecf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-17",
        title: "Retinoids: The Gold Standard",
        content: "Start with retinol 2-3x per week. Build tolerance slowly.",
        mediaUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-18",
        title: "Vitamin C for Brightness",
        content: "Morning vitamin C serum helps with dark spots and dullness.",
        mediaUrl: "https://images.unsplash.com/photo-1617611548714-7a9da5f8c8b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-19",
        title: "Hyaluronic Acid Hydration",
        content: "Plump skin with hyaluronic acid. Apply to damp skin for best results.",
        mediaUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-20",
        title: "Don't Forget Your Neck",
        content: "Extend all products down to your neck and décolletage area.",
        mediaUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-21",
        title: "Consistency Wins",
        content: "Results take 12+ weeks. Stay consistent and patient!",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Anti-Aging Products",
        ctaUrl: "/product-recommendations"
      }
    ]
  },
  {
    id: "story-5",
    title: "Sensitive Skin Solutions",
    description: "Gentle care for reactive skin",
    category: "sensitive",
    thumbnailUrl: "https://images.unsplash.com/photo-1617611548714-7a9da5f8c8b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    duration: 25,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [
      {
        id: "page-22",
        title: "Sensitive Skin Care",
        content: "Gentle doesn't mean ineffective. Here's how to care for reactive skin.",
        mediaUrl: "https://images.unsplash.com/photo-1617611548714-7a9da5f8c8b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-23",
        title: "Patch Test Everything",
        content: "Always test new products on your inner arm before applying to face.",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-4f6e9d7c1e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-24",
        title: "Fragrance-Free Zone",
        content: "Avoid products with fragrances, essential oils, and strong actives.",
        mediaUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-25",
        title: "Ceramides & Niacinamide",
        content: "Look for gentle ingredients that strengthen your skin barrier.",
        mediaUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5
      },
      {
        id: "page-26",
        title: "Less is More",
        content: "Keep routines simple. 3-4 products max until skin calms down.",
        mediaUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        mediaType: "image",
        duration: 5,
        ctaText: "Sensitive Skin Guide",
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Web Stories</h1>
          <p className="text-muted-foreground">
            Quick, visual skincare tips and tutorials in story format
          </p>
        </div>

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