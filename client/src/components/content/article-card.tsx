import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Clock, Eye, Heart, BookOpen, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Save/unsave article mutation
  const saveMutation = useMutation({
    mutationFn: async (articleId: string) => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }
      
      const response = await apiRequest(`/api/articles/${articleId}/save`, 'POST');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/saved-articles'] });
      toast({
        title: "Article saved",
        description: "Added to your reading list",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive",
      });
    },
  });

  const categoryColors = {
    guide: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ingredient: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    routine: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    review: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    deal: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    'local-brand': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveMutation.mutate(article.id);
  };

  const handleClick = () => {
    if (!isAuthenticated && article.isPremium) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to article
    window.location.href = `/articles/${article.id}`;
  };

  if (variant === 'compact') {
    return (
      <>
        <div 
          className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
          onClick={handleClick}
          data-testid={`article-card-compact-${article.id}`}
        >
          <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
            {article.featuredImageUrl ? (
              <img 
                src={article.featuredImageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary/60" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Badge 
              className={`${categoryColors[article.category as keyof typeof categoryColors]} text-xs mb-1`}
            >
              {article.category}
            </Badge>
            
            <h3 className="font-medium text-sm leading-tight mb-1 truncate">
              {article.title}
            </h3>
            
            <div className="flex items-center text-xs text-muted-foreground space-x-3">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTimeMinutes || article.readTime || 5}min
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : formatDistanceToNow(new Date(article.createdAt))} ago
              </span>
            </div>
          </div>
          
          {article.isPremium && !isAuthenticated && (
            <Badge variant="outline" className="text-xs">Premium</Badge>
          )}
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  if (variant === 'featured') {
    return (
      <>
        <Card 
          className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-testid={`article-card-featured-${article.id}`}
        >
          <div className="relative h-48 overflow-hidden">
            {article.featuredImageUrl ? (
              <img 
                src={article.featuredImageUrl} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/60" />
              </div>
            )}
            
            {article.isPremium && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                Premium
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              data-testid={`save-article-${article.id}`}
            >
              <Heart className={`w-4 h-4 ${article.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          
          <CardContent className="p-4">
            <Badge 
              className={`${categoryColors[article.category as keyof typeof categoryColors]} mb-2`}
            >
              {article.category}
            </Badge>
            
            <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTimeMinutes || article.readTime || 5}min read
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views || 0} views
                </span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : formatDistanceToNow(new Date(article.createdAt))} ago
              </div>
            </div>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <Card 
        className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-md"
        onClick={handleClick}
        data-testid={`article-card-${article.id}`}
      >
        <div className="flex">
          <div className="w-24 h-24 bg-muted flex-shrink-0 overflow-hidden">
            {article.featuredImageUrl ? (
              <img 
                src={article.featuredImageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary/60" />
              </div>
            )}
          </div>
          
          <CardContent className="flex-1 p-3">
            <div className="flex items-start justify-between mb-2">
              <Badge 
                className={`${categoryColors[article.category as keyof typeof categoryColors]} text-xs`}
              >
                {article.category}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                data-testid={`save-article-${article.id}`}
              >
                <Heart className={`w-3 h-3 ${article.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            
            <h3 className="font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            
            <div className="flex items-center text-xs text-muted-foreground space-x-3">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTimeMinutes || article.readTime || 5}min
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : formatDistanceToNow(new Date(article.createdAt))} ago
              </span>
              {article.isPremium && (
                <Badge variant="outline" className="text-xs">Premium</Badge>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}