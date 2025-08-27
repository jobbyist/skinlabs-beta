import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, User } from "lucide-react";
import { Link } from "wouter";
import { WebStory } from "@shared/schema";

export default function WebStoriesPage() {
  const { data: stories, isLoading } = useQuery<WebStory[]>({
    queryKey: ['/api/web-stories'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[9/16] bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SKINDEEP Stories</h1>
        <p className="text-muted-foreground">
          Bite-sized visual stories about skincare tips, routines, and product reviews
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {stories?.map((story) => (
          <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <Link href={`/stories/${story.slug}`}>
              <div className="cursor-pointer">
                <div className="aspect-[9/16] bg-muted relative overflow-hidden">
                  {story.coverImage && (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  {story.category && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-black/50 text-white"
                      data-testid={`badge-category-${story.id}`}
                    >
                      {story.category}
                    </Badge>
                  )}
                  
                  {/* Title and info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 
                      className="text-white font-semibold text-sm line-clamp-2 mb-1"
                      data-testid={`text-title-${story.id}`}
                    >
                      {story.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-white/80">
                      {story.author && (
                        <div className="flex items-center gap-1" data-testid={`text-author-${story.id}`}>
                          <User className="h-3 w-3" />
                          <span>{story.author}</span>
                        </div>
                      )}
                      
                      {story.publishedAt && (
                        <div className="flex items-center gap-1" data-testid={`text-date-${story.id}`}>
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(story.publishedAt).toLocaleDateString('en-ZA', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {!stories || stories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No stories available yet</h3>
          <p className="text-muted-foreground">
            Check back soon for engaging skincare stories!
          </p>
        </div>
      ) : null}
    </div>
  );
}