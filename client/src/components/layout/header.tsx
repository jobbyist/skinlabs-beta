import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  Heart, 
  Crown, 
  Settings, 
  LogOut,
  Home,
  BookOpen,
  Beaker,
  Calendar,
  Star,
  ShoppingBag,
  Building
} from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [notificationCount] = useState(3);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Guides", path: "/?category=guides", icon: BookOpen },
    { name: "Ingredients", path: "/?category=ingredients", icon: Beaker },
    { name: "Routines", path: "/?category=routines", icon: Calendar },
    { name: "Reviews", path: "/?category=reviews", icon: Star },
    { name: "Deals", path: "/?category=deals", icon: ShoppingBag },
    { name: "Local Brands", path: "/?category=local_brands", icon: Building },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-nav border-b border-border">
      <div className="max-w-skynn mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <button 
            onClick={() => setLocation("/")} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            data-testid="brand-logo"
          >
            <div className="brand-icon">🇿🇦</div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wide">SKYNN</span>
              <span className="text-xs text-muted-foreground font-medium">by SkinLabs®</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.slice(1).map((item) => (
              <button
                key={item.name}
                onClick={() => setLocation(item.path)}
                className="text-sm font-medium hover:text-primary transition-colors"
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Area */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex p-2 h-auto"
              data-testid="search-toggle"
            >
              <Search className="w-4 h-4" />
            </Button>
            
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 h-auto"
                  data-testid="notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                  )}
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 p-2 h-auto"
                      data-testid="user-menu"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-semibold">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <div className="text-sm font-semibold">{user.email.split('@')[0]}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      <div className="mt-1">
                        {user.subscriptionStatus === "free_lifetime" && (
                          <Badge variant="secondary" className="text-xs">
                            🎉 Founding Member
                          </Badge>
                        )}
                        {user.subscriptionStatus === "trial" && (
                          <Badge variant="outline" className="text-xs">
                            Premium Trial
                          </Badge>
                        )}
                        {user.subscriptionStatus === "active" && (
                          <Badge variant="default" className="text-xs">
                            Premium Member
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => setLocation("/dashboard")} data-testid="menu-dashboard">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem data-testid="menu-saved">
                      <Heart className="w-4 h-4 mr-2" />
                      Saved Articles
                    </DropdownMenuItem>
                    
                    {user.subscriptionStatus === "trial" && (
                      <DropdownMenuItem data-testid="menu-upgrade">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem data-testid="menu-settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-muted-foreground"
                      data-testid="menu-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLocation("/auth")}
                  data-testid="login-button"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setLocation("/auth")}
                  data-testid="signup-button"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Join
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden p-2 h-auto"
                  data-testid="mobile-menu"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => setLocation(item.path)}
                          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/10 text-left"
                          data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                  
                  {!isAuthenticated && (
                    <div className="pt-4 border-t mt-4">
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setLocation("/auth")}
                        >
                          Sign In
                        </Button>
                        <Button 
                          className="w-full" 
                          onClick={() => setLocation("/auth")}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Join SKYNN
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
