// Additional type definitions for the SKYNN platform

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  rating?: number;
  sortBy?: 'date' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface SkinAnalysis {
  skinType: string;
  concerns: string[];
  recommendations: string[];
  products: Array<{
    name: string;
    category: string;
    reason: string;
  }>;
}

export interface RoutineStep {
  order: number;
  timeOfDay: 'morning' | 'evening' | 'both';
  product: {
    name: string;
    brand: string;
    category: string;
    instructions: string;
  };
  frequency: 'daily' | 'alternate' | 'weekly';
  notes?: string;
}

export interface PersonalizedRoutine {
  id: string;
  name: string;
  description: string;
  steps: RoutineStep[];
  skinType: string;
  concerns: string[];
  estimatedCost: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  newArticles: boolean;
  deals: boolean;
  weeklyDigest: boolean;
  productRecommendations: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  notifications: NotificationPreferences;
  privacy: {
    profileVisibility: 'public' | 'private';
    shareData: boolean;
    analytics: boolean;
  };
}

export interface Review {
  id: string;
  userId: string;
  productId?: string;
  articleId?: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  skinType?: string;
  age?: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  ingredients: string[];
  price: {
    amount: number;
    currency: string;
  };
  availability: {
    inStock: boolean;
    stores: string[];
    onlineUrl?: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  suitableFor: {
    skinTypes: string[];
    concerns: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIRecommendation {
  type: 'product' | 'routine' | 'article' | 'tip';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    skinProfile?: boolean;
    productQuery?: string;
    routineStep?: number;
  };
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  data: Partial<{
    skinType: string;
    concerns: string[];
    goals: string[];
    fitzpatrickScale: number;
    budget: number;
    routinePreference: string;
    allergies: string[];
    currentProducts: Record<string, any>;
  }>;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SubscriptionTier = 'free' | 'trial' | 'premium' | 'lifetime';

export type ContentStatus = 'draft' | 'published' | 'archived' | 'featured';

export type UserRole = 'user' | 'admin' | 'editor' | 'contributor';

// Form types for better type safety
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProfileFormData {
  skinType: string;
  concerns: string[];
  goals: string[];
  fitzpatrickScale: number;
  monthlyBudget: number;
  routinePreference: string;
  allergies: string[];
}

export interface ReviewFormData {
  productId?: string;
  articleId?: string;
  rating: number;
  title: string;
  content: string;
  skinType?: string;
  age?: number;
}

// API Response types
export interface AuthResponse {
  user: any; // Will be typed from schema
  token: string;
  refreshToken?: string;
}

export interface SubscriptionResponse {
  status: string;
  plan: string;
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

// Error types
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  public fields: Record<string, string>;
  
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class NetworkError extends Error {
  public status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}
