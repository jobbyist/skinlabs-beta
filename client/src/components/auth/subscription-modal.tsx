import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { apiRequest } from "@/lib/queryClient";

import { Crown, Check, X, Star, Sparkles, Zap } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/upgrade", { plan: "premium" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Subscription upgraded!",
        description: "Welcome to SKYNN Premium! Enjoy all premium features.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade failed",
        description: error.message || "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = () => {
    upgradeMutation.mutate();
  };

  const trialDaysLeft = user?.trialEndDate 
    ? Math.max(0, Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto" data-testid="subscription-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <DialogTitle>Choose Your Plan</DialogTitle>
                <DialogDescription className="mt-1">
                  Unlock premium content and exclusive member benefits
                </DialogDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="close-subscription"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Free Lifetime Plan */}
            <Card className="border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Free Lifetime</CardTitle>
                <div className="text-2xl font-bold text-primary">R0</div>
                <div className="text-sm text-muted-foreground">For the first 1000 members</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Access to all guides and articles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Basic skin profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Save favorite articles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">SKYNN AI assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Exclusive deals</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled
                  data-testid="free-plan-button"
                >
                  {user?.isFoundingMember ? "Current Plan" : "Not Available"}
                </Button>
              </CardContent>
            </Card>
            
            {/* Premium Plan */}
            <Card className="relative border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  RECOMMENDED
                </Badge>
              </div>
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-lg">Premium</CardTitle>
                <div className="text-2xl font-bold text-primary">R99</div>
                <div className="text-sm text-muted-foreground">per month</div>
                {user?.subscriptionStatus === "trial" && (
                  <div className="text-xs text-primary font-medium">
                    {trialDaysLeft} days left in trial
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>SKYNN AI skincare assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Advanced skin analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Exclusive deals & discounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Monthly giveaways</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Dermatologist Q&A priority</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Custom routine builder</span>
                  </li>
                </ul>
                {user?.subscriptionStatus === "trial" ? (
                  <Button 
                    className="w-full" 
                    onClick={handleUpgrade}
                    disabled={upgradeMutation.isPending}
                    data-testid="upgrade-to-premium"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {upgradeMutation.isPending ? "Upgrading..." : "Upgrade to Premium"}
                  </Button>
                ) : user?.subscriptionStatus === "active" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    data-testid="start-trial"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Start 14-Day Free Trial
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Features Comparison */}
          <div className="bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Why Premium?</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium">AI-Powered Recommendations</span>
                </div>
                <p className="text-muted-foreground text-xs ml-6">
                  Get personalized skincare advice from our advanced AI assistant
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium">Exclusive Content</span>
                </div>
                <p className="text-muted-foreground text-xs ml-6">
                  Access premium guides and member-only skincare content
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>No commitment. Cancel anytime.</p>
            {user?.subscriptionStatus === "trial" && (
              <p className="mt-1">Trial automatically converts to paid subscription unless cancelled.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
