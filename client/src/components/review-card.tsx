import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp, ThumbsDown, Flag, Shield, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import type { Review } from '@shared/schema';

interface ReviewWithUser extends Review {
  author: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  hasVoted?: {
    helpful: boolean;
  } | null;
}

interface ReviewCardProps {
  review: ReviewWithUser;
  showProduct?: boolean;
}

export function ReviewCard({ review, showProduct = true }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const voteHelpfulMutation = useMutation({
    mutationFn: async ({ reviewId, helpful }: { reviewId: string; helpful: boolean }) => {
      return apiRequest(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        body: JSON.stringify({ helpful }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
    },
  });

  const reportReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return apiRequest(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
    },
  });

  const handleVoteHelpful = (helpful: boolean) => {
    if (!isAuthenticated) return;
    voteHelpfulMutation.mutate({ reviewId: review.id, helpful });
  };

  const handleReport = () => {
    if (!isAuthenticated) return;
    reportReviewMutation.mutate(review.id);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const shouldTruncate = review.content.length > 300;
  const displayContent = shouldTruncate && !isExpanded 
    ? review.content.slice(0, 300) + '...' 
    : review.content;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.author.profileImageUrl} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {review.author.firstName[0]}{review.author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">
                  {review.author.firstName} {review.author.lastName[0]}.
                </span>
                {review.purchaseVerified && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                </span>
                {review.skinType && (
                  <>
                    <span>•</span>
                    <span>{review.skinType} skin</span>
                  </>
                )}
                {review.ageRange && (
                  <>
                    <span>•</span>
                    <span>Age {review.ageRange}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            disabled={reportReviewMutation.isPending}
            data-testid={`button-report-${review.id}`}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showProduct && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">{review.title}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{review.productName}</span> by {review.brand}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm font-medium">{review.rating}/5 stars</span>
          {review.wouldRecommend ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Would recommend
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              Wouldn't recommend
            </Badge>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {displayContent}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-pink-600 hover:text-pink-700 text-sm font-medium mt-2"
              data-testid={`button-expand-${review.id}`}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {review.imageUrls && review.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {review.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Review image ${index + 1}`}
                className="rounded-lg object-cover aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                data-testid={`review-image-${review.id}-${index}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Was this helpful?
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant={review.hasVoted?.helpful === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVoteHelpful(true)}
                disabled={!isAuthenticated || voteHelpfulMutation.isPending}
                data-testid={`button-helpful-yes-${review.id}`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Yes ({review.helpful})
              </Button>
              <Button
                variant={review.hasVoted?.helpful === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVoteHelpful(false)}
                disabled={!isAuthenticated || voteHelpfulMutation.isPending}
                data-testid={`button-helpful-no-${review.id}`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                No
              </Button>
            </div>
          </div>

          {!review.isApproved && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              Pending Review
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}