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
      // Delay popup appearance for first-time visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 30000); // 30 seconds

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
      <DialogContent className="w-[320px] sm:w-[380px] mx-auto rounded-2xl border-0 p-0 overflow-hidden max-h-[500px] overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-2">
                <Crown className="h-8 w-8" />
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-center text-white mb-1">
                  Join Our Founding Members!
                </DialogTitle>
              </DialogHeader>
              
              <p className="text-xs text-white/90">
                Be among the first 100 users for lifetime benefits
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Founding Member Benefits */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Founding Member Benefits</span>
              </div>
              
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-primary rounded-full flex-shrink-0"></div>
                  Free lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-primary rounded-full flex-shrink-0"></div>
                  Early access to features
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-primary rounded-full flex-shrink-0"></div>
                  Exclusive special offers
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-primary rounded-full flex-shrink-0"></div>
                  Founding member badge
                </li>
              </ul>
            </div>



            {/* Live stats */}
            <div className="text-center py-2">
              {isFoundingMemberSpotAvailable ? (
                <Badge variant="destructive" className="text-xs mb-1">
                  Only {spotsRemaining} spots left!
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs mb-1">
                  All spots claimed
                </Badge>
              )}
              
              <div className="text-xs text-muted-foreground">
                {foundingMemberCount}/100 founding members
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Link href="/auth?tab=register">
                <Button 
                  className="w-full h-10 text-sm font-semibold"
                  onClick={handleSignUp}
                  data-testid="join-founding-members-button"
                  disabled={!isFoundingMemberSpotAvailable}
                >
                  <Crown className="h-3 w-3 mr-2" />
                  {isFoundingMemberSpotAvailable ? 'Join Now' : 'Spots Full'}
                </Button>
              </Link>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-8 text-xs" 
                  onClick={handleRemindLater}
                  data-testid="remind-later-button"
                >
                  Later
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 h-8 text-xs" 
                  onClick={handleClose}
                  data-testid="no-thanks-button"
                >
                  No Thanks
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}