import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Percent } from "lucide-react";
import { Deal } from "@shared/schema";
import { BannerAd, DisplayAd } from "@/components/ads/adsense-block";
// import { AdSlot, ShopifyAffiliateBanner } from "@/components/ads/ad-slot"; // Temporarily disabled

export default function SponsoredOffersPage() {
  const { data: offers, isLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
    select: (data) => data?.filter(deal => deal.isActive) || [],
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

  const formatPrice = (price: number) => {
    return `R${(price / 100).toFixed(2)}`;
  };

  const isExpiringSoon = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 3;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner Ad */}
      <BannerAd className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sponsored Offers & Deals</h1>
        <p className="text-muted-foreground">
          Exclusive deals on skincare products from trusted South African brands
        </p>
      </div>

      {/* Featured section ad */}
      {/* AdSlot placeholder */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers?.map((offer) => (
          <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
            {offer.discountPercentage && offer.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-red-500 text-white" data-testid={`badge-discount-${offer.id}`}>
                  <Percent className="h-3 w-3 mr-1" />
                  {offer.discountPercentage}% OFF
                </Badge>
              </div>
            )}
            
            {offer.isPremium && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600" data-testid={`badge-premium-${offer.id}`}>
                  Premium
                </Badge>
              </div>
            )}

            {offer.imageUrl && (
              <div className="aspect-[4/3] bg-muted relative">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2" data-testid={`text-title-${offer.id}`}>
                  {offer.title}
                </CardTitle>
                
                {isExpiringSoon(offer.expiresAt) && (
                  <Badge variant="destructive" className="text-xs whitespace-nowrap" data-testid={`badge-expiring-${offer.id}`}>
                    Ending Soon
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-primary" data-testid={`text-brand-${offer.id}`}>
                {offer.brand}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              {offer.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`text-description-${offer.id}`}>
                  {offer.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                {offer.originalPrice && offer.discountedPrice ? (
                  <>
                    <span className="text-lg font-bold text-green-600" data-testid={`text-discounted-price-${offer.id}`}>
                      {formatPrice(offer.discountedPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${offer.id}`}>
                      {formatPrice(offer.originalPrice)}
                    </span>
                  </>
                ) : offer.originalPrice ? (
                  <span className="text-lg font-bold" data-testid={`text-price-${offer.id}`}>
                    {formatPrice(offer.originalPrice)}
                  </span>
                ) : null}
              </div>

              {offer.category && (
                <div className="mb-4">
                  <Badge variant="outline" data-testid={`badge-category-${offer.id}`}>
                    {offer.category}
                  </Badge>
                </div>
              )}

              {offer.code && (
                <div className="mb-4 p-2 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Use code:</p>
                  <code className="font-mono font-semibold text-primary" data-testid={`text-code-${offer.id}`}>
                    {offer.code}
                  </code>
                </div>
              )}

              <div className="flex items-center justify-between">
                {offer.expiresAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`text-expires-${offer.id}`}>
                    <Clock className="h-3 w-3" />
                    <span>
                      Expires {new Date(offer.expiresAt).toLocaleDateString('en-ZA')}
                    </span>
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  asChild
                  data-testid={`button-claim-deal-${offer.id}`}
                >
                  <a 
                    href={offer.affiliateUrl || offer.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Claim Deal
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!offers || offers.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No active offers available</h3>
          <p className="text-muted-foreground">
            Check back soon for exclusive skincare deals and offers!
          </p>
        </div>
      ) : null}
    </div>
  );
}