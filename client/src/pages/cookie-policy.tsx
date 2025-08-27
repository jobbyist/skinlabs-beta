import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export default function CookiePolicy() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem('skynn-cookie-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('skynn-cookie-preferences', JSON.stringify(preferences));
    localStorage.setItem('skynn-cookie-consent', 'custom');
    alert('Cookie preferences saved successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
          </div>
          
          <div className="text-sm text-muted-foreground mb-8">
            Effective Date: January 1, 2025 | Last Updated: January 24, 2025
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our platform, and delivering personalized content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p>SKYNN uses cookies and similar technologies for the following purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>To keep you logged in to your account</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze platform usage and improve our services</li>
                <li>To deliver personalized content and recommendations</li>
                <li>To serve relevant advertisements</li>
                <li>To prevent fraud and enhance security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-sm mb-2">
                    These cookies are necessary for the website to function properly. They enable core 
                    functionality such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Session cookies:</strong> Maintain your logged-in state</li>
                    <li><strong>Security cookies:</strong> Protect against CSRF attacks</li>
                    <li><strong>Load balancing:</strong> Ensure optimal server performance</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-sm mb-2">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Google Analytics:</strong> Track page views, session duration, bounce rate</li>
                    <li><strong>Performance monitoring:</strong> Identify and fix technical issues</li>
                    <li><strong>A/B testing:</strong> Improve user experience through testing</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Marketing Cookies</h3>
                  <p className="text-sm mb-2">
                    These cookies track your browsing habits to deliver advertisements relevant to you 
                    and your interests.
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Google AdSense:</strong> Display relevant advertisements</li>
                    <li><strong>Retargeting cookies:</strong> Show ads based on your activity</li>
                    <li><strong>Social media pixels:</strong> Enable sharing and social features</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Personalization Cookies</h3>
                  <p className="text-sm mb-2">
                    These cookies remember your preferences and choices to provide a customized experience.
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Theme preferences:</strong> Remember light/dark mode selection</li>
                    <li><strong>Language settings:</strong> Display content in your preferred language</li>
                    <li><strong>Content recommendations:</strong> Show relevant articles based on history</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Cookie Management</h2>
              
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Your Cookie Preferences
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Essential Cookies</div>
                      <div className="text-sm text-muted-foreground">Always enabled (required for site to function)</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-5 w-5"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Analytics Cookies</div>
                      <div className="text-sm text-muted-foreground">Help us improve our services</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                      className="h-5 w-5"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Marketing Cookies</div>
                      <div className="text-sm text-muted-foreground">Deliver relevant advertisements</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                      className="h-5 w-5"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Personalization Cookies</div>
                      <div className="text-sm text-muted-foreground">Remember your preferences</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={(e) => setPreferences({...preferences, personalization: e.target.checked})}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSavePreferences} className="w-full mt-6">
                  Save Cookie Preferences
                </Button>
              </Card>
              
              <h3 className="text-lg font-semibold mb-2">Browser Cookie Settings</h3>
              <p>
                You can also manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>View what cookies are stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block all cookies or third-party cookies</li>
                <li>Receive a warning before a cookie is stored</li>
              </ul>
              
              <p className="mt-4">
                Please note that blocking all cookies may affect the functionality of our website 
                and prevent you from using certain features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Third-Party Cookies</h2>
              <p>
                Some cookies on our platform are placed by third-party services that appear on our pages. 
                We do not control these cookies. Third-party providers include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Google Analytics:</strong> Analytics and performance monitoring</li>
                <li><strong>Google AdSense:</strong> Advertisement delivery</li>
                <li><strong>PayPal:</strong> Payment processing</li>
                <li><strong>SendGrid:</strong> Email communications</li>
              </ul>
              <p className="mt-2">
                Please refer to these third parties' privacy policies for information about their cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Cookie Duration</h2>
              <p>Cookies can be either:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Session cookies:</strong> Temporary cookies that are deleted when you close your browser
                </li>
                <li>
                  <strong>Persistent cookies:</strong> Remain on your device for a set period or until manually deleted
                </li>
              </ul>
              
              <div className="mt-4">
                <p><strong>Our cookie durations:</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Authentication cookies: 7 days</li>
                  <li>Preference cookies: 1 year</li>
                  <li>Analytics cookies: 2 years</li>
                  <li>Marketing cookies: 90 days</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for legal, operational, or regulatory reasons. We will notify you of any material 
                changes through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
              <p>
                If you have questions about our use of cookies or this policy, please contact us at:
              </p>
              <div className="mt-2 pl-6">
                <p>Email: privacy@skinlabs.co.za</p>
                <p>Address: Cape Town, South Africa</p>
              </div>
            </section>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}