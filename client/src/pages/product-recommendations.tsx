import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Heart } from "lucide-react";
import { ProductRecommendation } from "@shared/schema";

export default function ProductRecommendationsPage() {
  const { data: recommendations, isLoading } = useQuery<ProductRecommendation[]>({
    queryKey: ['/api/product-recommendations'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Recommendations</h1>
        <p className="text-muted-foreground">
          Expertly curated skincare products tailored for South African skin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations?.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {product.featuredImage && (
              <div className="aspect-square bg-muted relative">
                <img
                  src={product.featuredImage}
                  alt={product.productName}
                  className="object-cover w-full h-full"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  data-testid={`button-save-${product.id}`}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg line-clamp-2" data-testid={`text-product-name-${product.id}`}>
                    {product.productName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground" data-testid={`text-brand-${product.id}`}>
                    {product.brand}
                  </p>
                </div>
                
                {product.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span data-testid={`text-rating-${product.id}`}>{product.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {product.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3">
                {product.category && (
                  <Badge variant="secondary" data-testid={`badge-category-${product.id}`}>
                    {product.category}
                  </Badge>
                )}
                {product.skinTypes?.slice(0, 2).map((type) => (
                  <Badge key={type} variant="outline" data-testid={`badge-skin-type-${type}-${product.id}`}>
                    {type}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                {product.price && (
                  <span className="font-semibold text-lg" data-testid={`text-price-${product.id}`}>
                    R{(product.price / 100).toFixed(2)}
                  </span>
                )}
                
                {product.affiliateUrl && (
                  <Button 
                    size="sm" 
                    asChild
                    data-testid={`button-view-product-${product.id}`}
                  >
                    <a 
                      href={product.affiliateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      View Product
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!recommendations || recommendations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground">
            Check back soon for expertly curated product recommendations!
          </p>
        </div>
      ) : null}
    </div>
  );
}