import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, X } from "lucide-react";
import { Link } from "wouter";
import { useFoundingMembers } from "@/hooks/use-founding-members";

export default function LaunchBanner() {
  const [isVisible, setIsVisible] = useState(
    !localStorage.getItem('skynn-launch-banner-dismissed')
  );
  const { foundingMemberCount, spotsRemaining, isFoundingMemberSpotAvailable } = useFoundingMembers();

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('skynn-launch-banner-dismissed', 'true');
  };

  if (!isVisible || !isFoundingMemberSpotAvailable) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-3 md:p-4">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Crown className="h-5 w-5 flex-shrink-0" />
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                Launch Special
              </Badge>
              <span className="text-sm font-medium">
                {spotsRemaining} founding member spots left!
              </span>
            </div>
            <p className="text-xs text-white/90 hidden sm:block">
              Join the first 100 users for lifetime free access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/auth?tab=register">
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 text-xs font-semibold"
              data-testid="banner-join-button"
            >
              Join Now
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            data-testid="dismiss-banner-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}