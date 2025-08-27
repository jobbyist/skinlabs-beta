import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gift, Crown, Sparkles, Users, Calendar, X, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useFoundingMembers } from "@/hooks/use-founding-members";

export default function LaunchPromotionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { foundingMemberCount, spotsRemaining, contestProgress, isFoundingMemberSpotAvailable, isContestActive } = useFoundingMembers();

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('skynn-launch-popup-seen');
    const popupLastShown = localStorage.getItem('skynn-launch-popup-date');
    
    // Show popup if never seen, or if last shown was more than 7 days ago
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const shouldShow = !hasSeenPopup || 
      (popupLastShown && parseInt(popupLastShown) < oneWeekAgo);

    if (shouldShow) {
      // Delay popup appearance to avoid being intrusive
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('skynn-launch-popup-seen', 'true');
    localStorage.setItem('skynn-launch-popup-date', Date.now().toString());
  };

  const handleSignUp = () => {
    handleClose();
  };

  const handleRemindLater = () => {
    setIsOpen(false);
    // Set reminder for 24 hours later
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('skynn-launch-popup-date', tomorrow.toString());
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-4 rounded-2xl border-0 p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 z-10 h-8 w-8 p-0 bg-black/20 hover:bg-black/30 text-white rounded-full"
            onClick={handleClose}
            data-testid="close-launch-popup"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-6 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Crown className="h-8 w-8" />
                </div>
              </div>
              
              <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30">
                Official Launch
              </Badge>
              
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
                  Join Our Founding Members!
                </DialogTitle>
              </DialogHeader>
              
              <p className="text-sm text-white/90 leading-relaxed">
                Be among the first 100 users to experience SKYNN and unlock exclusive lifetime benefits
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Founding Member Benefits */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Founding Member Benefits</h3>
                </div>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    Free lifetime access to our platform
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    Early access to new features
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    Exclusive special offers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    Founding member badge & recognition
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Gift Hamper Contest */}
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Gift className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold">Win R500 Gift Hamper!</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    5 lucky founding members will win our premium R500 skincare gift hamper
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium">Target: 250 sign-ups</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium">Deadline: End of September</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Winners announced on our website, TikTok, Facebook & Instagram
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Live stats and availability */}
            <div className="space-y-3">
              {/* Founding member spots */}
              <div className="text-center space-y-2">
                {isFoundingMemberSpotAvailable ? (
                  <Badge variant="destructive" className="text-xs">
                    Only {spotsRemaining} founding member spots left!
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    All founding member spots claimed
                  </Badge>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {foundingMemberCount}/100 founding members joined
                </div>
              </div>

              {/* Contest progress */}
              {isContestActive && (
                <Card className="border-primary/20">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Contest Progress</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(contestProgress)}%
                      </span>
                    </div>
                    
                    <Progress value={contestProgress} className="h-2 mb-2" />
                    
                    <div className="text-xs text-muted-foreground text-center">
                      {Math.round((contestProgress / 100) * 250)} / 250 sign-ups for gift hamper drawing
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <Link href="/auth?tab=register">
                <Button 
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleSignUp}
                  data-testid="join-founding-members-button"
                  disabled={!isFoundingMemberSpotAvailable}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {isFoundingMemberSpotAvailable ? 'Become a Founding Member' : 'Founding Member Spots Full'}
                </Button>
              </Link>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleRemindLater}
                  data-testid="remind-later-button"
                >
                  Remind Me Tomorrow
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1" 
                  onClick={handleClose}
                  data-testid="maybe-later-button"
                >
                  Maybe Later
                </Button>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-xs text-center text-muted-foreground pt-2">
              This offer is valid for a limited time only. Don't miss out!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}