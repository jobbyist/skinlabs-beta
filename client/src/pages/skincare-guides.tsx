import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Bookmark, User } from "lucide-react";
import { Link } from "wouter";
import { Article } from "@shared/schema";

export default function SkincareGuidesPage() {
  const { data: guides, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    select: (data) => data?.filter(article => article.category === 'guides') || [],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skincare Guides</h1>
        <p className="text-muted-foreground">
          Comprehensive guides to help you build the perfect skincare routine for South African conditions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides?.map((guide) => (
          <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <Link href={`/articles/${guide.id}`}>
              <div className="cursor-pointer">
                {guide.featuredImageUrl && (
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <img
                      src={guide.featuredImageUrl}
                      alt={guide.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {guide.isPremium && (
                      <Badge 
                        className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600"
                        data-testid={`badge-premium-${guide.id}`}
                      >
                        Premium
                      </Badge>
                    )}
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${guide.id}`}>
                    {guide.title}
                  </CardTitle>
                  {guide.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-excerpt-${guide.id}`}>
                      {guide.excerpt}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {guide.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" data-testid={`badge-tag-${tag}-${guide.id}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {guide.readTimeMinutes && (
                        <div className="flex items-center gap-1" data-testid={`text-read-time-${guide.id}`}>
                          <Clock className="h-3 w-3" />
                          <span>{guide.readTimeMinutes} min read</span>
                        </div>
                      )}
                      {guide.views && (
                        <div className="flex items-center gap-1" data-testid={`text-views-${guide.id}`}>
                          <Eye className="h-3 w-3" />
                          <span>{guide.views.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle bookmark toggle
                      }}
                      data-testid={`button-bookmark-${guide.id}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {!guides || guides.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No guides available yet</h3>
          <p className="text-muted-foreground">
            Check back soon for comprehensive skincare guides!
          </p>
        </div>
      ) : null}
    </div>
  );
}