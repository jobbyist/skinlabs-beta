import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          
          <div className="text-sm text-muted-foreground mb-8">
            Effective Date: January 1, 2025 | Last Updated: January 24, 2025
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using SKYNN by SkinLabs ("the Platform"), you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Description of Services</h2>
              <p>
                SKYNN provides curated skincare content, product recommendations, ingredient information, 
                and community features. Our services include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Expertly curated skincare guides and articles</li>
                <li>Product reviews and recommendations</li>
                <li>Ingredient analysis and education</li>
                <li>Community forums and discussions</li>
                <li>Personalized skin profiling tools</li>
                <li>Premium subscription features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <h3 className="text-lg font-semibold mb-2">3.1 Registration</h3>
              <p>
                You must provide accurate, complete, and current information during registration. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">3.2 Account Security</h3>
              <p>
                You are responsible for all activities that occur under your account. 
                Notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Subscription Tiers</h2>
              <h3 className="text-lg font-semibold mb-2">4.1 Founding Members (First 100 Users)</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Lifetime free access to all premium features</li>
                <li>Special recognition and badges</li>
                <li>Early access to new features</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">4.2 Trial Users (Users 101-1000)</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>30-day free trial of premium features</li>
                <li>Option to upgrade to annual subscription</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">4.3 Premium Subscribers (Users 1000+)</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Annual subscription fee: $9.99 USD</li>
                <li>Full access to all premium features</li>
                <li>Cancel anytime with access until end of billing period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. User Content</h2>
              <h3 className="text-lg font-semibold mb-2">5.1 Content Guidelines</h3>
              <p>Users must not post content that is:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Illegal, harmful, or offensive</li>
                <li>Infringing on intellectual property rights</li>
                <li>Containing medical advice without proper qualifications</li>
                <li>Spam or misleading information</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">5.2 Content License</h3>
              <p>
                By posting content, you grant SKYNN a non-exclusive, worldwide, royalty-free license 
                to use, reproduce, and distribute your content within the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Medical Disclaimer</h2>
              <p className="font-semibold">
                SKYNN provides general skincare information and is not a substitute for professional 
                medical advice. Always consult with qualified healthcare providers for medical concerns.
              </p>
              <p className="mt-2">
                The information provided on this platform is for educational and informational purposes only. 
                Individual results may vary, and we make no guarantees about skincare outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Payment Terms</h2>
              <h3 className="text-lg font-semibold mb-2">7.1 Billing</h3>
              <p>
                Premium subscriptions are billed annually in advance. We accept payments via PayPal 
                and major credit cards.
              </p>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">7.2 Refunds</h3>
              <p>
                We offer a 14-day money-back guarantee for first-time premium subscribers. 
                Refund requests must be submitted through our support channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
              <p>
                All content on SKYNN, including text, graphics, logos, and software, is the property 
                of SkinLabs or its content suppliers and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Privacy</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy. 
                Please review our Privacy Policy to understand how we collect and use your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SKYNN SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the platform 
                after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Governing Law</h2>
              <p>
                These terms are governed by the laws of South Africa, without regard to its conflict 
                of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">13. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-2 pl-6">
                <p>Email: legal@skinlabs.co.za</p>
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