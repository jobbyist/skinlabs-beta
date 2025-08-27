import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Eye, Clock, Pin, Lock, Plus } from "lucide-react";
import { Link } from "wouter";
import { ForumPost } from "@shared/schema";

export default function CommunityForumPage() {
  const { data: posts, isLoading } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/posts'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            Connect with fellow skincare enthusiasts and share your journey
          </p>
        </div>
        
        <Button data-testid="button-new-post">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="default" className="cursor-pointer" data-testid="badge-category-all">
          All
        </Badge>
        <Badge variant="outline" className="cursor-pointer" data-testid="badge-category-skincare-help">
          Skincare Help
        </Badge>
        <Badge variant="outline" className="cursor-pointer" data-testid="badge-category-product-reviews">
          Product Reviews
        </Badge>
        <Badge variant="outline" className="cursor-pointer" data-testid="badge-category-routines">
          Routines
        </Badge>
        <Badge variant="outline" className="cursor-pointer" data-testid="badge-category-diy">
          DIY
        </Badge>
        <Badge variant="outline" className="cursor-pointer" data-testid="badge-category-general">
          General
        </Badge>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <Link href={`/forum/posts/${post.id}`}>
              <div className="cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback data-testid={`avatar-${post.id}`}>
                        {post.userId ? post.userId.substring(0, 2).toUpperCase() : 'AN'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-primary" data-testid={`icon-pinned-${post.id}`} />
                        )}
                        {post.isLocked && (
                          <Lock className="h-4 w-4 text-muted-foreground" data-testid={`icon-locked-${post.id}`} />
                        )}
                        <CardTitle className="text-lg line-clamp-2" data-testid={`text-title-${post.id}`}>
                          {post.title}
                        </CardTitle>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span data-testid={`text-user-${post.id}`}>
                          {post.userId || 'Anonymous'}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1" data-testid={`text-date-${post.id}`}>
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(post.createdAt || '').toLocaleDateString('en-ZA')}
                          </span>
                        </div>
                        {post.category && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" data-testid={`badge-category-${post.id}`}>
                              {post.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2 mb-3" data-testid={`text-content-${post.id}`}>
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1" data-testid={`text-replies-${post.id}`}>
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replyCount || 0} replies</span>
                      </div>
                      <div className="flex items-center gap-1" data-testid={`text-views-${post.id}`}>
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount || 0} views</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}-${post.id}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to start a conversation in the community!
          </p>
          <Button data-testid="button-create-first-post">
            Create the First Post
          </Button>
        </div>
      ) : null}
    </div>
  );
}