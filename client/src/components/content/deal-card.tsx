import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Deal } from "@shared/schema";

import { ShoppingBag, ExternalLink, Tag, Calendar } from "lucide-react";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function DealCard({ deal, className = "" }: DealCardProps) {
  const handleShopNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(deal.url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      clean_beauty: "🌿",
      pharmacy: "💊",
      organic: "🌱",
      local_brand: "🇿🇦",
      natural: "🌸",
      professional: "⚕️",
      clinic: "🏥",
      "e-tail": "🛒",
      marketplace: "🏪",
      "k-beauty": "🇰🇷",
    };
    return icons[category as keyof typeof icons] || "🛍️";
  };

  const formatValidUntil = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expired";
    if (diffDays === 1) return "Ends today";
    if (diffDays <= 7) return `${diffDays} days left`;
    return `Valid until ${date.toLocaleDateString()}`;
  };

  return (
    <div 
      className={`deal-card rounded-lg p-4 min-w-[280px] transition-all duration-200 hover:shadow-md ${className}`}
      data-testid={`deal-card-${deal.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(deal.category || "")}</span>
          <div>
            <div className="font-semibold text-sm">{deal.brand}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {deal.category?.replace('_', ' ') || 'Deal'}
            </div>
          </div>
        </div>
        
        {deal.discountPercentage && (
          <Badge variant="default" className="bg-primary text-primary-foreground font-bold">
            {deal.discountPercentage}% OFF
          </Badge>
        )}
      </div>
      
      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
        {deal.title}
      </h3>
      
      {deal.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {deal.description}
        </p>
      )}
      
      <div className="space-y-2">
        {deal.code && (
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono bg-muted/50 px-2 py-1 rounded">
              Code: {deal.code}
            </span>
          </div>
        )}
        
        {deal.validUntil && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatValidUntil(new Date(deal.validUntil))}</span>
          </div>
        )}
      </div>
      
      <Button
        size="sm"
        className="w-full mt-3"
        onClick={handleShopNow}
        data-testid={`shop-deal-${deal.id}`}
      >
        <ShoppingBag className="w-3 h-3 mr-2" />
        Shop Now
        <ExternalLink className="w-3 h-3 ml-2" />
      </Button>
    </div>
  );
}
