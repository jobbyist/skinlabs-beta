import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, User, LogOut, Settings, Heart, Headphones } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-skynn mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">SKYNN</h1>
                <p className="text-xs text-muted-foreground -mt-1">by SkinLabs</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/skincare-guides" className="text-sm font-medium transition-colors hover:text-primary">
              Guides
            </Link>
            <Link href="/product-recommendations" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/streams" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
              <Headphones className="h-4 w-4" />
              Streams
            </Link>
            <Link href="/sponsored-offers" className="text-sm font-medium transition-colors hover:text-primary">
              Offers
            </Link>
          </nav>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {/* User Badge for Founding Members */}
                {user?.isFoundingMember && (
                  <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span className="text-xs">Founding Member</span>
                  </Badge>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu-trigger">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || undefined} alt="Profile" />
                        <AvatarFallback className="text-xs">
                          {user?.email ? getUserInitials(user.email) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.subscriptionStatus === 'founding_member' ? 'Founding Member' :
                           user?.subscriptionStatus === 'premium' ? 'Premium Member' :
                           user?.subscriptionStatus === 'trial' ? 'Free Trial' : 'Free Member'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem data-testid="menu-profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Saved Articles
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-600 focus:text-red-600"
                      data-testid="menu-logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthClick('login')}
                  data-testid="header-login-button"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAuthClick('register')}
                  data-testid="header-register-button"
                >
                  Join SKYNN
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onAuthSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    </>
  );
}