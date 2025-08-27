import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { apiRequest } from "@/lib/queryClient";
import type { Article } from "@shared/schema";

import { Bookmark, BookmarkCheck, Star, Clock, ExternalLink } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export default function ArticleCard({ article, className = "" }: ArticleCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        const response = await apiRequest("DELETE", `/api/user/save-article/${article.id}`);
        return response;
      } else {
        const response = await apiRequest("POST", "/api/user/save-article", { articleId: article.id });
        return response.json();
      }
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ["/api/user/saved-articles"] });
      toast({
        title: isSaved ? "Article unsaved" : "Article saved!",
        description: isSaved ? "Removed from your saved articles" : "Added to your saved articles",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save article",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save articles.",
        variant: "destructive",
      });
      return;
    }
    
    saveMutation.mutate();
  };

  const handleClick = () => {
    // In a real implementation, this would navigate to the article detail page
    window.open(`/articles/${article.id}`, '_blank');
  };

  const formatRating = (rating: number) => {
    return (rating / 10).toFixed(1);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      guides: "bg-blue-500/20 text-blue-400",
      ingredients: "bg-green-500/20 text-green-400",
      routines: "bg-purple-500/20 text-purple-400",
      reviews: "bg-yellow-500/20 text-yellow-400",
      deals: "bg-orange-500/20 text-orange-400",
      local_brands: "bg-pink-500/20 text-pink-400",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <article 
      className={`group cursor-pointer article-card ${className}`}
      onClick={handleClick}
      data-testid={`article-card-${article.id}`}
    >
      <div className="glass-panel p-4 h-full flex flex-col">
        {/* Image */}
        {article.imageUrl && (
          <div className="relative overflow-hidden rounded-lg mb-3">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {article.isFeatured && (
              <Badge 
                variant="default" 
                className="absolute top-2 left-2 bg-primary text-primary-foreground"
              >
                Featured
              </Badge>
            )}
          </div>
        )}
        
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge 
            variant="secondary" 
            className={`text-xs capitalize ${getCategoryColor(article.category)}`}
          >
            {article.category.replace('_', ' ')}
          </Badge>
          {article.tags && article.tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-grow">
          {article.title}
        </h3>
        
        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {article.excerpt}
          </p>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center gap-3">
            {/* Rating */}
            {article.rating && article.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(article.rating / 10) 
                          ? "text-yellow-400 fill-current" 
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground ml-1">
                  {formatRating(article.rating)}
                </span>
              </div>
            )}
            
            {/* Read Time */}
            {article.readTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{article.readTime} min</span>
              </div>
            )}
          </div>
          
          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-primary hover:text-primary hover:bg-primary/10"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-testid={`save-article-${article.id}`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
