import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User, Bell } from "lucide-react";
import { useAuth, useClerk } from "@clerk/clerk-react";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn: isAuthenticated } = useAuth();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Skincare Guides", href: "/skincare-guides" },
    { name: "Product Reviews", href: "/product-recommendations" },
    { name: "DIY Recipes", href: "/diy-recipes" },
    { name: "Web Stories", href: "/web-stories" },
    { name: "Community", href: "/community-forum" },
    { name: "Deals", href: "/sponsored-offers" },
  ];

  const authItems = isAuthenticated ? [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
  ] : [
    { name: "Sign In", href: "/auth" },
    { name: "Join Now", href: "/auth?tab=register" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <img 
            src="/src/assets/skinlabs-logo.png" 
            alt="SkinLabs" 
            className="h-7 w-auto"
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {isAuthenticated && (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                {/* User section */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 p-4 border-b">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        User
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Member
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-auto py-4">
                  <div className="space-y-1 px-2">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Explore
                    </h3>
                    {menuItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <button
                          className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </button>
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1 px-2 mt-6">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Account
                    </h3>
                    {authItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <button
                          className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </button>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Footer */}
                <div className="border-t p-4">
                  <p className="text-xs text-muted-foreground text-center">
                    SKYNN by SkinLabs &copy; 2024
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}