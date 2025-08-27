import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("skynn-auth-token");
  });
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Handle OAuth callback tokens
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken && urlParams.get('auth') === 'success') {
      localStorage.setItem("skynn-auth-token", urlToken);
      setToken(urlToken);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refetch user data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    }
  }, [queryClient]);

  // Query to get current user if token exists
  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else if (!isLoading && token) {
      // Token is invalid, clear it
      logout();
    }
  }, [currentUser, isLoading, token]);

  useEffect(() => {
    // Set up axios interceptor to include auth token
    const originalFetch = window.fetch;
    window.fetch = function (input: RequestInfo | URL, init: RequestInit = {}) {
      if (token && typeof input === 'string' && input.startsWith('/api/')) {
        init.headers = {
          ...init.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

  const login = (userData: User, authToken: string) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("skynn-auth-token", authToken);
    queryClient.setQueryData(["/api/auth/me"], userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("skynn-auth-token");
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading: isLoading && !!token,
    login,
    logout,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
