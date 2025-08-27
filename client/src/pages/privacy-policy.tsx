import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="text-sm text-muted-foreground mb-8">
            Effective Date: January 1, 2025 | Last Updated: January 24, 2025
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p>
                SKYNN by SkinLabs ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2">2.1 Personal Information</h3>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Skin profile information (skin type, concerns, goals)</li>
                <li>Payment information (processed securely via PayPal)</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <p>When you use our platform, we automatically collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Device information (type, operating system, browser)</li>
                <li>IP address and location data</li>
                <li>Usage data (pages viewed, time spent, interactions)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience and recommendations</li>
                <li>Process transactions and manage subscriptions</li>
                <li>Send administrative and promotional communications</li>
                <li>Improve our platform and develop new features</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Information Sharing</h2>
              <h3 className="text-lg font-semibold mb-2">4.1 We DO NOT Sell Your Data</h3>
              <p className="font-semibold">
                We do not sell, rent, or trade your personal information to third parties for their 
                marketing purposes.
              </p>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">4.2 Service Providers</h3>
              <p>We may share information with trusted service providers who help us operate our platform:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment processors (PayPal)</li>
                <li>Email service providers (SendGrid)</li>
                <li>Analytics services (Google Analytics)</li>
                <li>Cloud hosting providers</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">4.3 Legal Requirements</h3>
              <p>
                We may disclose information if required by law or to protect our rights, property, 
                or safety, or that of our users or others.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Secure password hashing (bcrypt)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Your Rights (POPIA Compliance)</h2>
              <p>Under South African Protection of Personal Information Act (POPIA), you have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the Information Regulator</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, contact us at privacy@skinlabs.co.za
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Cookies and Tracking</h2>
              <h3 className="text-lg font-semibold mb-2">7.1 Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">7.2 Managing Cookies</h3>
              <p>
                You can manage cookie preferences through our cookie consent banner or your browser settings. 
                Disabling certain cookies may limit platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 16. We do not knowingly collect 
                personal information from children under 16. If we become aware of such collection, 
                we will delete the information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than South Africa. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to provide our services and 
                comply with legal obligations. When data is no longer needed, we securely delete or 
                anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible for 
                the privacy practices of these external sites. Please review their privacy policies 
                before providing any information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of material changes 
                via email or platform notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">13. Contact Information</h2>
              <p>For privacy-related questions or concerns, contact us at:</p>
              <div className="mt-2 pl-6">
                <p><strong>Email:</strong> privacy@skinlabs.co.za</p>
                <p><strong>Data Protection Officer:</strong> dpo@skinlabs.co.za</p>
                <p><strong>Address:</strong> Cape Town, South Africa</p>
              </div>
              
              <p className="mt-4">
                <strong>Information Regulator (South Africa)</strong><br />
                Email: complaints.IR@justice.gov.za<br />
                Website: https://justice.gov.za/inforeg/
              </p>
            </section>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}