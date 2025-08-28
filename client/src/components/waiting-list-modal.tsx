import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface WaitingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitingListModal({ isOpen, onClose }: WaitingListModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("/api/waiting-list", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          category: "cashback_card"
        }),
      });

      toast({
        title: "You're on the list! 🎉",
        description: "We'll notify you as soon as the cashback rewards card launches.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Join the Cashback Card Waiting List
          </DialogTitle>
          <DialogDescription>
            Be among the first to get our exclusive cashback rewards card when it launches in December 2024.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              data-testid="input-waiting-list-name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              data-testid="input-waiting-list-email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+27 XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              data-testid="input-waiting-list-phone"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
              data-testid="button-submit-waiting-list"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Waiting List"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              data-testid="button-cancel-waiting-list"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}