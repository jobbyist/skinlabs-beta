import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Cookie, Settings, X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and disabled
    analytics: true,
    marketing: true,
    personalization: true
  });

  useEffect(() => {
    const hasConsented = localStorage.getItem('skynn-cookie-consent');
    
    if (!hasConsented) {
      // Show after 5 seconds for first-time visitors
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    localStorage.setItem('skynn-cookie-consent', 'accepted-all');
    localStorage.setItem('skynn-cookie-preferences', JSON.stringify(allPreferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    localStorage.setItem('skynn-cookie-consent', 'rejected-optional');
    localStorage.setItem('skynn-cookie-preferences', JSON.stringify(minimalPreferences));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('skynn-cookie-consent', 'custom');
    localStorage.setItem('skynn-cookie-preferences', JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="max-w-6xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border shadow-lg">
        <div className="p-4 md:p-6">
          {!showSettings ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Cookie className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base">Cookie Preferences</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We use cookies to enhance your browsing experience, personalize content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                      <Link href="/privacy-policy" className="text-primary underline">
                        Privacy Policy
                      </Link>
                      {' '}and{' '}
                      <Link href="/cookie-policy" className="text-primary underline">
                        Cookie Policy
                      </Link>.
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-8 w-8 p-0"
                  aria-label="Close cookie banner"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial"
                  data-testid="accept-all-cookies"
                >
                  Accept All
                </Button>
                <Button 
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                  data-testid="reject-optional-cookies"
                >
                  Reject Optional
                </Button>
                <Button 
                  onClick={() => setShowSettings(!showSettings)}
                  variant="ghost"
                  className="flex-1 sm:flex-initial"
                  data-testid="cookie-settings"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Cookie Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">Necessary Cookies</div>
                    <p className="text-xs text-muted-foreground">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">Analytics Cookies</div>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">Marketing Cookies</div>
                    <p className="text-xs text-muted-foreground">
                      Used to deliver personalized advertisements and promotions.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                </div>

                {/* Personalization Cookies */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">Personalization Cookies</div>
                    <p className="text-xs text-muted-foreground">
                      Remember your preferences and customize your experience.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.personalization}
                    onChange={(e) => setPreferences({...preferences, personalization: e.target.checked})}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSavePreferences} className="flex-1">
                  Save Preferences
                </Button>
                <Button onClick={() => setShowSettings(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}