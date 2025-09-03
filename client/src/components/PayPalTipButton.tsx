import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Heart, Loader2 } from "lucide-react";

interface PayPalTipButtonProps {
  episodeId: string;
  episodeTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PayPalTipButton({
  episodeId,
  episodeTitle,
  open,
  onOpenChange
}: PayPalTipButtonProps) {
  const [tipAmount, setTipAmount] = useState("1.00");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isSignedIn: isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const predefinedAmounts = ["1.00", "5.00", "10.00", "25.00"];

  const handleQuickAmount = (amount: string) => {
    setTipAmount(amount);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setTipAmount(value);
    }
  };

  const isValidAmount = () => {
    const amount = parseFloat(tipAmount);
    return amount >= 1.00 && amount <= 1000.00;
  };

  const processTip = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to tip creators.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidAmount()) {
      toast({
        title: "Invalid amount",
        description: "Tip amount must be between $1.00 and $1000.00",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create PayPal order
      const orderResponse = await fetch("/api/paypal/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: tipAmount,
          currency: "USD",
          intent: "CAPTURE",
          episodeId,
          episodeTitle
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      // Initialize PayPal checkout
      await initializePayPalCheckout(orderData.id);
      
    } catch (error) {
      console.error("Tip processing error:", error);
      toast({
        title: "Payment failed",
        description: "Something went wrong processing your tip. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const initializePayPalCheckout = async (orderId: string) => {
    try {
      // Get client token
      const tokenResponse = await fetch("/api/paypal/setup");
      const { clientToken } = await tokenResponse.json();

      // Load PayPal SDK if not already loaded
      if (!(window as any).paypal) {
        const script = document.createElement("script");
        script.src = import.meta.env.PROD
          ? "https://www.paypal.com/web-sdk/v6/core"
          : "https://www.sandbox.paypal.com/web-sdk/v6/core";
        script.async = true;
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
          document.body.appendChild(script);
        });
      }

      // Create PayPal instance
      const sdkInstance = await (window as any).paypal.createInstance({
        clientToken,
        components: ["paypal-payments"],
      });

      const paypalCheckout = sdkInstance.createPayPalOneTimePaymentSession({
        onApprove: async (data: any) => {
          try {
            const captureResponse = await fetch(`/api/paypal/order/${data.orderId}/capture`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!captureResponse.ok) {
              throw new Error("Failed to capture payment");
            }

            const captureData = await captureResponse.json();
            
            toast({
              title: "🎉 Tip successful!",
              description: `Thank you for your $${tipAmount} tip! Your support means a lot.`,
            });

            onOpenChange(false);
            setTipAmount("1.00");
          } catch (error) {
            console.error("Payment capture error:", error);
            toast({
              title: "Payment processing failed",
              description: "Your payment couldn't be processed. Please contact support.",
              variant: "destructive"
            });
          } finally {
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          toast({
            title: "Payment cancelled",
            description: "Your tip was cancelled.",
          });
        },
        onError: (error: any) => {
          console.error("PayPal error:", error);
          setIsProcessing(false);
          toast({
            title: "Payment error",
            description: "There was an error processing your payment.",
            variant: "destructive"
          });
        },
      });

      // Start the payment flow
      await paypalCheckout.start(
        { paymentFlow: "auto" },
        Promise.resolve({ orderId })
      );

    } catch (error) {
      console.error("PayPal initialization error:", error);
      setIsProcessing(false);
      toast({
        title: "Payment setup failed",
        description: "Could not initialize payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Tip the Creator
          </DialogTitle>
          <DialogDescription>
            Show your appreciation for "{episodeTitle}" with a tip. 
            Your support helps create more amazing content!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Quick Amount Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Choose a tip amount
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={tipAmount === amount ? "default" : "outline"}
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleQuickAmount(amount)}
                  disabled={isProcessing}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <Label htmlFor="custom-tip" className="text-sm font-medium mb-2 block">
              Or enter a custom amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="custom-tip"
                type="text"
                placeholder="1.00"
                value={tipAmount}
                onChange={handleCustomAmount}
                className="pl-10 text-lg font-semibold"
                disabled={isProcessing}
                data-testid="input-tip-amount"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum tip: $1.00 • Maximum: $1,000.00
            </p>
          </div>

          {!isAuthenticated && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please sign in to tip creators and support the SKYNN community.
              </p>
            </div>
          )}

          {/* Tip Button */}
          <Button
            onClick={processTip}
            disabled={!isValidAmount() || isProcessing}
            className="w-full h-12 text-lg font-semibold"
            data-testid="button-process-tip"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Tip ${isValidAmount() ? parseFloat(tipAmount).toFixed(2) : "0.00"}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payments powered by PayPal • Your support helps creators continue making amazing content
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}