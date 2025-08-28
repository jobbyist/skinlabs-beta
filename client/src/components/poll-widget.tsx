import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { TrendingUp, Vote } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userVote?: string;
}

export function PollWidget() {
  const { isAuthenticated } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Fetch poll data
  const { data: poll, refetch } = useQuery<Poll>({
    queryKey: ['/api/poll/current'],
    enabled: isAuthenticated,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (optionId: string) => {
      return await apiRequest('POST', '/api/poll/vote', { optionId });
    },
    onSuccess: () => {
      refetch();
    }
  });

  const handleVote = () => {
    if (selectedOption) {
      voteMutation.mutate(selectedOption);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20 rounded-xl p-6">
        <div className="text-center">
          <Vote className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-2">Poll of the Week</h3>
          <p className="text-sm text-muted-foreground">Sign in to participate in our community polls</p>
        </div>
      </div>
    );
  }

  const mockPoll: Poll = poll || {
    id: "poll-1",
    question: "What's your favourite, must-have skincare product right now?",
    options: [
      { id: "1", text: "SKOON. Skincare", votes: 245 },
      { id: "2", text: "Standard Beauty", votes: 189 },
      { id: "3", text: "Lumi Glo", votes: 156 },
      { id: "4", text: "Lelive", votes: 134 },
      { id: "5", text: "African Botanics", votes: 98 }
    ],
    totalVotes: 822,
    hasVoted: false
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Poll of the Week</h3>
        <Badge variant="secondary">
          <TrendingUp className="h-3 w-3 mr-1" />
          {mockPoll.totalVotes} votes
        </Badge>
      </div>
      
      <p className="text-sm font-medium mb-4">{mockPoll.question}</p>

      {!mockPoll.hasVoted ? (
        <div className="space-y-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {mockPoll.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label 
                  htmlFor={option.id} 
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption || voteMutation.isPending}
            className="w-full"
            data-testid="poll-submit"
          >
            {voteMutation.isPending ? "Submitting..." : "Submit Vote"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {mockPoll.options.map((option) => {
            const percentage = mockPoll.totalVotes > 0 
              ? Math.round((option.votes / mockPoll.totalVotes) * 100) 
              : 0;
            const isUserVote = mockPoll.userVote === option.id;
            
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className={isUserVote ? "font-medium" : ""}>
                    {option.text}
                    {isUserVote && <span className="ml-2 text-primary">✓ Your vote</span>}
                  </span>
                  <span className="text-muted-foreground">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <span className="text-xs text-muted-foreground">{option.votes} votes</span>
              </div>
            );
          })}
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Thank you for participating! New poll every week.
          </p>
        </div>
      )}
    </div>
  );
}