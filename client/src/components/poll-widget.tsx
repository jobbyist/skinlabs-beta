import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, Clock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@clerk/clerk-react';
import type { Poll, PollVote } from '@shared/schema';

interface PollOption {
  text: string;
  votes: number;
}

interface PollWithVotes extends Poll {
  options: PollOption[];
  totalVotes: number;
  userVote?: number;
}

const mockPolls: PollWithVotes[] = [
  {
    id: '1',
    title: 'What\'s your biggest skincare concern?',
    description: 'Help us understand what the SKYNN community wants to focus on most.',
    options: [
      { text: 'Acne & breakouts', votes: 234 },
      { text: 'Anti-aging & wrinkles', votes: 189 },
      { text: 'Hyperpigmentation', votes: 156 },
      { text: 'Dryness & dehydration', votes: 98 },
      { text: 'Sensitivity & redness', votes: 67 },
    ],
    totalVotes: 744,
    isActive: true,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    userVote: undefined,
  },
  {
    id: '2', 
    title: 'Which South African skincare brand deserves more recognition?',
    description: 'Vote for your favorite local SA brand that needs more spotlight.',
    options: [
      { text: 'Esse Probiotic Skincare', votes: 78 },
      { text: 'African Botanics', votes: 65 },
      { text: 'Skin Functional', votes: 52 },
      { text: 'Africology', votes: 43 },
      { text: 'Okha', votes: 38 },
    ],
    totalVotes: 276,
    isActive: true,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    userVote: 0, // User voted for first option
  },
  {
    id: '3',
    title: 'Best time for skincare routine?',
    description: 'When do you prefer to do your full skincare routine?',
    options: [
      { text: 'Morning only', votes: 89 },
      { text: 'Evening only', votes: 234 },
      { text: 'Both morning & evening', votes: 345 },
      { text: 'Whenever I remember!', votes: 123 },
    ],
    totalVotes: 791,
    isActive: false,
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Ended 1 day ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    userVote: 2, // User voted for third option
  },
];

interface PollWidgetProps {
  pollId?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function PollWidget({ pollId, showTitle = true, compact = false }: PollWidgetProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { user, isSignedIn: isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // This would normally fetch from API
  const { data: polls = mockPolls } = useQuery({
    queryKey: ['/api/polls', pollId],
    enabled: false, // Using mock data for now
  });

  const voteMutation = useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) => {
      return apiRequest(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionIndex }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
    },
  });

  const handleVote = (poll: PollWithVotes, optionIndex: number) => {
    if (!isAuthenticated || poll.userVote !== undefined || !poll.isActive) return;
    
    setSelectedOption(optionIndex);
    voteMutation.mutate({ pollId: poll.id, optionIndex });
  };

  const getPolls = () => {
    if (pollId) {
      return polls.filter(poll => poll.id === pollId);
    }
    return polls.slice(0, compact ? 1 : 3); // Show fewer polls in compact mode
  };

  if (getPolls().length === 0) {
    return null;
  }

  return (
    <div className={`space-y-${compact ? '4' : '6'}`}>
      {showTitle && !compact && (
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-pink-600" />
          <h2 className="text-xl font-semibold text-gray-900">Community Polls</h2>
        </div>
      )}
      
      {getPolls().map((poll) => (
        <Card key={poll.id} className={`${compact ? '' : 'hover:shadow-md'} transition-shadow`}>
          <CardHeader className={compact ? 'pb-3' : ''}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} mb-2`}>
                  {poll.title}
                </CardTitle>
                {!compact && poll.description && (
                  <p className="text-gray-600 text-sm mb-3">{poll.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {poll.totalVotes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {poll.isActive 
                      ? `${formatDistanceToNow(poll.endDate!)} left`
                      : 'Poll ended'
                    }
                  </span>
                  {!poll.isActive && (
                    <Badge variant="outline" className="text-xs bg-gray-100">
                      Closed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {poll.options.map((option, index) => {
                const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                const isUserChoice = poll.userVote === index;
                const isSelected = selectedOption === index;
                const canVote = isAuthenticated && poll.userVote === undefined && poll.isActive;
                
                return (
                  <div
                    key={index}
                    className={`relative p-3 rounded-lg border transition-colors ${
                      canVote 
                        ? 'cursor-pointer hover:bg-pink-50 hover:border-pink-200' 
                        : 'cursor-default'
                    } ${
                      isUserChoice 
                        ? 'bg-pink-100 border-pink-300' 
                        : isSelected 
                        ? 'bg-pink-50 border-pink-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => canVote && handleVote(poll, index)}
                    data-testid={`poll-option-${poll.id}-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isUserChoice ? 'text-pink-800' : 'text-gray-700'}`}>
                        {option.text}
                        {isUserChoice && (
                          <Check className="inline-block h-4 w-4 ml-2 text-pink-600" />
                        )}
                      </span>
                      <span className="text-sm text-gray-600">
                        {option.votes} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    {/* Progress bar - only show if there are votes or user has voted */}
                    {(poll.totalVotes > 0 || poll.userVote !== undefined) && (
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        data-testid={`poll-progress-${poll.id}-${index}`}
                      />
                    )}
                    
                    {/* Loading state for current selection */}
                    {isSelected && voteMutation.isPending && (
                      <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-600 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Call to action for unauthenticated users */}
            {!isAuthenticated && poll.isActive && (
              <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <p className="text-sm text-pink-800 text-center">
                  <a href="/auth" className="font-medium hover:underline">
                    Sign in to vote
                  </a> and share your opinion with the community!
                </p>
              </div>
            )}
            
            {/* Thank you message for users who voted */}
            {isAuthenticated && poll.userVote !== undefined && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 text-center font-medium">
                  Thanks for voting! Results are updated in real-time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}