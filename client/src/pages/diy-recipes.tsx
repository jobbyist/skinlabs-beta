import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, Users, Bookmark } from "lucide-react";
import { Link } from "wouter";
import { DiyRecipe } from "@shared/schema";
import { BannerAd, DisplayAd, InArticleAd } from "@/components/ads/adsense-block";
// import { AdSlot, ShopifyAffiliateBanner } from "@/components/ads/ad-slot"; // Temporarily disabled

export default function DiyRecipesPage() {
  const { data: recipes, isLoading } = useQuery<DiyRecipe[]>({
    queryKey: ['/api/diy-recipes'],
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner Ad */}
      <BannerAd className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DIY Skincare Recipes</h1>
        <p className="text-muted-foreground">
          Natural, homemade skincare recipes using ingredients available in South Africa
        </p>
      </div>

      {/* Display Ad before recipes */}
      {/* AdSlot placeholder */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <Link href={`/diy-recipes/${recipe.slug}`}>
              <div className="cursor-pointer">
                {recipe.featuredImage && (
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <img
                      src={recipe.featuredImage}
                      alt={recipe.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {recipe.difficulty && (
                      <Badge 
                        className={`absolute top-3 left-3 ${getDifficultyColor(recipe.difficulty)}`}
                        data-testid={`badge-difficulty-${recipe.id}`}
                      >
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${recipe.id}`}>
                    {recipe.title}
                  </CardTitle>
                  {recipe.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${recipe.id}`}>
                      {recipe.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.skinTypes?.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" data-testid={`badge-skin-type-${type}-${recipe.id}`}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {recipe.prepTime && (
                        <div className="flex items-center gap-1" data-testid={`text-prep-time-${recipe.id}`}>
                          <Clock className="h-3 w-3" />
                          <span>{recipe.prepTime} min</span>
                        </div>
                      )}
                      {recipe.ingredients && (
                        <div className="flex items-center gap-1" data-testid={`text-ingredients-count-${recipe.id}`}>
                          <ChefHat className="h-3 w-3" />
                          <span>{Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 'N/A'} ingredients</span>
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
                      data-testid={`button-bookmark-${recipe.id}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {recipe.author && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground" data-testid={`text-author-${recipe.id}`}>
                      <Users className="h-3 w-3" />
                      <span>By {recipe.author}</span>
                    </div>
                  )}
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {!recipes || recipes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No DIY recipes available yet</h3>
          <p className="text-muted-foreground">
            Check back soon for natural skincare recipes you can make at home!
          </p>
        </div>
      ) : null}
      
      {/* Bottom In-Article Ad */}
      <InArticleAd className="mt-8" />
    </div>
  );
}