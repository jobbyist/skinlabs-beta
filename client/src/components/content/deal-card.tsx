import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { ExternalLink, Clock, Tag, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Deal } from "@shared/schema";

interface DealCardProps {
  deal: Deal;
  variant?: 'default' | 'featured' | 'compact';
}

export default function DealCard({ deal, variant = 'default' }: DealCardProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated && deal.isPremium) {
      setShowAuthModal(true);
      return;
    }
    
    // Track click and redirect
    window.open(deal.affiliateUrl || deal.url, '_blank', 'noopener,noreferrer');
  };

  const discountPercentage = deal.originalPrice && deal.discountedPrice 
    ? Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)
    : null;

  if (variant === 'compact') {
    return (
      <>
        <div 
          className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors border border-green-200 dark:border-green-800"
          onClick={handleClick}
          data-testid={`deal-card-compact-${deal.id}`}
        >
          <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
            {deal.imageUrl ? (
              <img 
                src={deal.imageUrl} 
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-500/60" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                {discountPercentage ? `${discountPercentage}% OFF` : 'DEAL'}
              </Badge>
              {deal.expiresAt && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(new Date(deal.expiresAt))} left
                </Badge>
              )}
            </div>
            
            <h3 className="font-medium text-sm leading-tight mb-1 truncate">
              {deal.title}
            </h3>
            
            <div className="flex items-center text-xs text-muted-foreground space-x-2">
              <span className="font-semibold text-green-600 dark:text-green-400">
                R{deal.discountedPrice || deal.originalPrice}
              </span>
              {deal.originalPrice && deal.discountedPrice && (
                <span className="line-through text-muted-foreground">
                  R{deal.originalPrice}
                </span>
              )}
            </div>
          </div>
          
          {deal.isPremium && !isAuthenticated && (
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
          className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg border-green-200 dark:border-green-800"
          onClick={handleClick}
          data-testid={`deal-card-featured-${deal.id}`}
        >
          <div className="relative h-48 overflow-hidden">
            {deal.imageUrl ? (
              <img 
                src={deal.imageUrl} 
                alt={deal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                <Tag className="w-16 h-16 text-green-500/60" />
              </div>
            )}
            
            {discountPercentage && (
              <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
            
            {deal.expiresAt && (
              <Badge variant="outline" className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(deal.expiresAt))} left
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {deal.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {deal.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  R{deal.discountedPrice || deal.originalPrice}
                </span>
                {deal.originalPrice && deal.discountedPrice && (
                  <span className="text-sm line-through text-muted-foreground">
                    R{deal.originalPrice}
                  </span>
                )}
              </div>
              
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <ExternalLink className="w-4 h-4 mr-1" />
                Get Deal
              </Button>
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
        className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-md border-green-200 dark:border-green-800"
        onClick={handleClick}
        data-testid={`deal-card-${deal.id}`}
      >
        <div className="flex">
          <div className="w-24 h-24 bg-muted flex-shrink-0 overflow-hidden">
            {deal.imageUrl ? (
              <img 
                src={deal.imageUrl} 
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-500/60" />
              </div>
            )}
          </div>
          
          <CardContent className="flex-1 p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                  {discountPercentage ? `${discountPercentage}% OFF` : 'DEAL'}
                </Badge>
                {deal.expiresAt && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(deal.expiresAt))} left
                  </Badge>
                )}
              </div>
              
              {deal.isPremium && (
                <Badge variant="outline" className="text-xs">Premium</Badge>
              )}
            </div>
            
            <h3 className="font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {deal.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  R{deal.discountedPrice || deal.originalPrice}
                </span>
                {deal.originalPrice && deal.discountedPrice && (
                  <span className="text-xs line-through text-muted-foreground">
                    R{deal.originalPrice}
                  </span>
                )}
              </div>
              
              <Button size="sm" variant="outline" className="text-xs h-6">
                <ExternalLink className="w-3 h-3 mr-1" />
                View
              </Button>
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