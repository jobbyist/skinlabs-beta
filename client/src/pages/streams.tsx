import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AudioPlayer, AudioPlayerSkeleton } from "@/components/audio/audio-player";
import { DisplayAd, InArticleAd } from "@/components/ads/adsense-block";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Headphones, TrendingUp, Clock, Sparkles } from "lucide-react";

// Import attached assets
import episode1Thumbnail from "@assets/IMG_3690_1756311502448.png";
import episode1Audio from "@assets/SKYNNs_Digital_Blueprint_Unpacking_Africas_Booming_Beauty_Market_with_AI_and_Community_1756311223685.mp3";

interface StreamEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl: string;
  duration: string;
  publishDate: string;
  category: string;
  isNew?: boolean;
  isTrending?: boolean;
  playCount?: number;
  likes?: number;
  dislikes?: number;
}

const mockEpisodes: StreamEpisode[] = [
  {
    id: "1",
    episodeNumber: 1,
    title: "Episode 1: Africa's Next-Generation Digital Skincare Platform Goes Live 🚀",
    description: "Join us as we unpack Africa's booming beauty market with AI and community-driven insights. Discover how SKYNN is revolutionizing skincare for African consumers.",
    audioUrl: episode1Audio,
    thumbnailUrl: episode1Thumbnail,
    duration: "15:30",
    publishDate: "Today",
    category: "Platform Launch",
    isNew: true,
    isTrending: true,
    playCount: 1247,
    likes: 89,
    dislikes: 2
  },
  {
    id: "2",
    episodeNumber: 2,
    title: "Understanding Your Skin Type: A Deep Dive with Dr. Thandi Ndlovu",
    description: "Dermatologist Dr. Thandi Ndlovu explains the science behind different skin types and how to identify yours for better skincare choices.",
    audioUrl: "", // Placeholder for future episodes
    thumbnailUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400",
    duration: "22:45",
    publishDate: "Coming Soon",
    category: "Expert Talks",
    isNew: true,
    playCount: 0,
    likes: 0,
    dislikes: 0
  },
  {
    id: "3",
    episodeNumber: 3,
    title: "The Rise of K-Beauty in South Africa: Trends and Must-Haves",
    description: "Explore the Korean beauty phenomenon taking South Africa by storm. Learn about the 10-step routine and which products are worth the hype.",
    audioUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    duration: "18:20",
    publishDate: "Coming Soon",
    category: "Beauty Trends",
    playCount: 0,
    likes: 0,
    dislikes: 0
  },
  {
    id: "4",
    episodeNumber: 4,
    title: "Natural Ingredients: African Beauty Secrets Passed Down Generations",
    description: "Discover traditional African beauty ingredients like shea butter, marula oil, and rooibos that are making waves in modern skincare.",
    audioUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1552046122-03184de85e08?w=400",
    duration: "20:15",
    publishDate: "Coming Soon",
    category: "Natural Beauty",
    playCount: 0,
    likes: 0,
    dislikes: 0
  },
  {
    id: "5",
    episodeNumber: 5,
    title: "Acne Solutions: Real Stories from the SKYNN Community",
    description: "Community members share their acne journey and the products that finally worked. Plus, expert tips on managing breakouts.",
    audioUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
    duration: "25:00",
    publishDate: "Coming Soon",
    category: "Community Stories",
    playCount: 0,
    likes: 0,
    dislikes: 0
  }
];

export default function StreamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Platform Launch", "Expert Talks", "Beauty Trends", "Natural Beauty", "Community Stories"];

  const filteredEpisodes = mockEpisodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          episode.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || episode.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-skynn mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="glass-panel p-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-3">THE SKINDEEP PODCAST</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A deep dive into everything skincare. Discover the latest skincare trends, 
                viral moments and expert opinions on skincare and wellness - with a humorous edge.
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search episodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-episodes"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Featured Episode */}
        {filteredEpisodes.length > 0 && filteredEpisodes[0].isNew && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Latest Episode</h2>
              <Badge variant="default">NEW</Badge>
              {filteredEpisodes[0].isTrending && (
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </Badge>
              )}
            </div>
            <AudioPlayer
              episodeNumber={filteredEpisodes[0].episodeNumber}
              title={filteredEpisodes[0].title}
              description={filteredEpisodes[0].description}
              audioUrl={filteredEpisodes[0].audioUrl}
              thumbnailUrl={filteredEpisodes[0].thumbnailUrl}
              duration={filteredEpisodes[0].duration}
              publishDate={filteredEpisodes[0].publishDate}
              playCount={filteredEpisodes[0].playCount}
              likes={filteredEpisodes[0].likes}
              dislikes={filteredEpisodes[0].dislikes}
            />
          </section>
        )}

        {/* Mid-page Ad */}
        <DisplayAd className="my-8" />

        {/* All Episodes */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-bold">All Episodes</h2>
            <Badge variant="outline">{filteredEpisodes.length} episodes</Badge>
          </div>
          
          <div className="space-y-4">
            {filteredEpisodes.slice(1).map((episode) => (
              <div key={episode.id}>
                <AudioPlayer
                  episodeNumber={episode.episodeNumber}
                  title={episode.title}
                  description={episode.description}
                  audioUrl={episode.audioUrl}
                  thumbnailUrl={episode.thumbnailUrl}
                  duration={episode.duration}
                  publishDate={episode.publishDate}
                  playCount={episode.playCount}
                  likes={episode.likes}
                  dislikes={episode.dislikes}
                />
              </div>
            ))}
            
            {/* In-feed Ad after every 3 episodes */}
            {filteredEpisodes.length > 4 && (
              <InArticleAd className="my-6" />
            )}
          </div>
          
          {filteredEpisodes.length === 0 && (
            <div className="text-center py-12">
              <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No episodes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}