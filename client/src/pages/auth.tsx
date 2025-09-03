import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { Crown } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLocation("/dashboard");
    }
  }, [isSignedIn, isLoaded, setLocation]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="brand-icon">🇿🇦</div>
            <div>
              <div className="text-2xl font-extrabold">SKYNN</div>
              <div className="text-sm text-muted-foreground font-medium">by SkinLabs®</div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Your personalized skincare journey starts here
          </p>
        </div>

        <Card className="glass-panel">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              {activeTab === "login" ? "Welcome Back" : "Join SKYNN"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login" 
                ? "Sign in to access your personalized skincare content" 
                : "Create your account and unlock premium skincare guidance"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="login-tab">Sign In</TabsTrigger>
                <TabsTrigger value="register" data-testid="register-tab">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="flex justify-center">
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-border hover:bg-accent",
                        formFieldInput: "border-border bg-background",
                        footerActionLink: "text-primary hover:text-primary/90",
                      },
                    }}
                    redirectUrl="/dashboard"
                    signUpUrl="?tab=register"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="text-sm text-center">
                    <Crown className="w-4 h-4 inline mr-1 text-primary" />
                    <strong>Free Lifetime Access</strong> for the first 1000 members
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-border hover:bg-accent",
                        formFieldInput: "border-border bg-background",
                        footerActionLink: "text-primary hover:text-primary/90",
                      },
                    }}
                    redirectUrl="/dashboard"
                    signInUrl="?tab=login"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                data-testid="back-home"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}