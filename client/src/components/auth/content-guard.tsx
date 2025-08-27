import { useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./auth-modal";

interface ContentGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
  triggerOnClick?: boolean;
}

export function ContentGuard({ 
  children, 
  fallback, 
  requireAuth = true, 
  triggerOnClick = true 
}: ContentGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // If not requiring auth, just render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If authenticated, render children normally
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If loading, show loading state
  if (isLoading) {
    return fallback || (
      <div className="animate-pulse bg-muted rounded-lg p-6">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
      </div>
    );
  }

  // If trigger on click, wrap in clickable element
  if (triggerOnClick) {
    return (
      <>
        <div 
          onClick={() => setShowAuthModal(true)}
          className="cursor-pointer group relative"
          data-testid="content-guard-trigger"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="text-center space-y-2 p-4">
              <p className="font-medium text-foreground">Sign up to read this content</p>
              <p className="text-sm text-muted-foreground">Join thousands of skincare enthusiasts</p>
            </div>
          </div>
          
          {/* Content with blur effect */}
          <div className="filter blur-sm group-hover:blur-none transition-all">
            {children}
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      </>
    );
  }

  // Default fallback
  return fallback || (
    <div className="bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
      <p className="text-muted-foreground mb-4">Sign up to access this content</p>
      <button 
        onClick={() => setShowAuthModal(true)}
        className="text-primary hover:underline"
        data-testid="content-guard-signup-link"
      >
        Create your account
      </button>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}