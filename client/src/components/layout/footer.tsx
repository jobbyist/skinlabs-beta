import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card dark:bg-card border-t border-border mt-16">
      <div className="max-w-skynn mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" data-testid="footer-logo">
              <div className="flex items-center space-x-2 mb-4">
                <div className="brand-icon">🇿🇦</div>
                <span className="text-lg font-bold">SKYNN</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              South Africa's trusted skincare platform. Expertly curated, derm-informed content 
              for your skincare journey.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <a href="https://instagram.com/skinlabs.co.za" target="_blank" rel="noopener" aria-label="Instagram" data-testid="social-instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <a href="https://twitter.com/skinlabsza" target="_blank" rel="noopener" aria-label="Twitter" data-testid="social-twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <a href="https://facebook.com/skinlabs.co.za" target="_blank" rel="noopener" aria-label="Facebook" data-testid="social-facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <a href="mailto:hello@skinlabs.co.za" aria-label="Email" data-testid="social-email">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/articles" data-testid="footer-articles">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Articles & Guides
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/ingredients" data-testid="footer-ingredients">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Ingredient Library
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/routines" data-testid="footer-routines">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Skincare Routines
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/deals" data-testid="footer-deals">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Deals & Offers
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/brands" data-testid="footer-brands">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Local Brands
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" data-testid="footer-help">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/contact" data-testid="footer-contact">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/faq" data-testid="footer-faq">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/subscription" data-testid="footer-subscription">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    Subscription
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <a 
                  href="mailto:hello@skinlabs.co.za" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-email"
                >
                  hello@skinlabs.co.za
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  Cape Town, South Africa
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  Available Mon-Fri, 9AM-5PM SAST
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SKYNN by SkinLabs. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            <Link to="/privacy-policy" data-testid="footer-privacy">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </button>
            </Link>
            <Link to="/terms-of-service" data-testid="footer-terms">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </button>
            </Link>
            <Link to="/cookie-policy" data-testid="footer-cookies">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}