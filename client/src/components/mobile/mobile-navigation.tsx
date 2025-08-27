import { Link, useLocation } from "wouter";
import { Home, BookOpen, ShoppingBag, User, Sparkles, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    authRequired: false
  },
  {
    name: "Guides",
    href: "/skincare-guides",
    icon: BookOpen,
    authRequired: false
  },
  {
    name: "Streams",
    href: "/streams",
    icon: Headphones,
    authRequired: false
  },
  {
    name: "Deals",
    href: "/sponsored-offers",
    icon: ShoppingBag,
    authRequired: false
  },
  {
    name: "Profile",
    href: "/dashboard",
    icon: User,
    authRequired: true
  }
];

export default function MobileNavigation() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  // Only show on mobile screens
  const isMobileScreen = window.innerWidth < 768;
  if (!isMobileScreen) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href !== "/" && location.startsWith(item.href));
          
          // Hide profile if not authenticated
          if (item.authRequired && !isAuthenticated) {
            return (
              <Link key={item.name} href="/auth">
                <button className="flex flex-col items-center justify-center min-w-0 px-2 py-2">
                  <div className={cn(
                    "rounded-full p-1.5 transition-colors",
                    "text-muted-foreground hover:text-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-0.5 text-muted-foreground">
                    Sign In
                  </span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href}>
              <button 
                className="flex flex-col items-center justify-center min-w-0 px-2 py-2"
                data-testid={`mobile-nav-${item.name.toLowerCase()}`}
              >
                <div className={cn(
                  "rounded-full p-1.5 transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs mt-0.5 transition-colors truncate max-w-12",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {item.name}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}