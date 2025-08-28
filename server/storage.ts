import { type User, type InsertUser, type UserSkinProfile, type InsertUserSkinProfile, type Article, type Deal, type SavedArticle, type InsertSavedArticle, waitingList } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users, userSkinProfiles, articles, deals, savedArticles } from "../shared/schema";
import { eq, and, desc, like, inArray, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByAppleId(appleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  
  // User skin profile
  getUserSkinProfile(userId: string): Promise<UserSkinProfile | undefined>;
  createUserSkinProfile(profile: InsertUserSkinProfile): Promise<UserSkinProfile>;
  updateUserSkinProfile(userId: string, updates: Partial<UserSkinProfile>): Promise<UserSkinProfile | undefined>;
  
  // Articles
  getArticles(limit?: number, category?: string): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  
  // Deals
  getActiveDeals(): Promise<Deal[]>;
  
  // Saved articles
  getSavedArticles(userId: string): Promise<Article[]>;
  saveArticle(data: InsertSavedArticle): Promise<SavedArticle>;
  unsaveArticle(userId: string, articleId: string): Promise<boolean>;
  
  // Founding member tracking
  getFoundingMemberCount(): Promise<number>;
  
  // Waiting list
  addToWaitingList(data: { name: string; email: string; phone?: string | null; category: string }): Promise<{ id: string }>;
}

export class DatabaseStorage implements IStorage {
  private users: Map<string, User>;
  private userSkinProfiles: Map<string, UserSkinProfile>;
  private articles: Map<string, Article>;
  private deals: Map<string, Deal>;
  private savedArticles: Map<string, SavedArticle>;
  private foundingMemberCount: number = 0;

  constructor() {
    this.users = new Map();
    this.userSkinProfiles = new Map();
    this.articles = new Map();
    this.deals = new Map();
    this.savedArticles = new Map();
    
    // Initialize with sample content
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample articles matching the prototype
    const sampleArticles: Article[] = [
      {
        id: randomUUID(),
        title: "Vitamin C: How to layer with Niacinamide",
        excerpt: "Complete guide to combining these powerhouse ingredients for maximum skin benefits.",
        content: "Detailed content about layering vitamin C and niacinamide...",
        category: "guides",
        tags: ["brightening", "beginner", "layering"],
        rating: 48, // 4.8 * 10 for storage
        readTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        authorId: null,
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Retinoids in SA: OTC vs Rx",
        excerpt: "Understanding the difference between over-the-counter and prescription retinoids available in South Africa.",
        content: "Comprehensive comparison of retinoid options...",
        category: "ingredients",
        tags: ["anti-aging", "night"],
        rating: 46,
        readTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        authorId: null,
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Winter-to-Spring Routine (Budget)",
        excerpt: "Affordable skincare routine transition for changing seasons in South Africa.",
        content: "Budget-friendly seasonal skincare routine...",
        category: "routines",
        tags: ["seasonal", "budget"],
        rating: 45,
        readTime: 6,
        imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        authorId: null,
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "SA mineral sunscreens roundup",
        excerpt: "Best mineral sunscreens from local South African brands.",
        content: "Comprehensive review of SA mineral sunscreens...",
        category: "local_brands",
        tags: ["sunscreen", "local"],
        rating: 43,
        readTime: 7,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        authorId: null,
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
      },
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });

    // Sample deals
    const sampleDeals: Deal[] = [
      {
        id: randomUUID(),
        brand: "Lumi Glo",
        title: "15% OFF ≥ R800",
        description: "Clean Beauty discount on orders over R800",
        discountPercentage: 15,
        code: "SKYNN15",
        url: "https://example.com/deal/lumiglo",
        category: "clean_beauty",
        isActive: true,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        brand: "Clicks",
        title: "3-for-2 Skincare Range",
        description: "ClubCard members only. Selected brands.",
        discountPercentage: null,
        code: "CLUBCARD",
        url: "https://clicks.co.za/",
        category: "pharmacy",
        isActive: true,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        brand: "Standard Beauty",
        title: "20% OFF First Order",
        description: "Local brand discount. New customers only.",
        discountPercentage: 20,
        code: "WELCOME20",
        url: "https://standard-beauty.co.za/promo",
        category: "local_brand",
        isActive: true,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    ];

    sampleDeals.forEach(deal => {
      this.deals.set(deal.id, deal);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(insertUser.passwordHash, 10);
    
    // First 1000 users get founding member status and free lifetime
    const isFoundingMember = this.foundingMemberCount < 1000;
    if (isFoundingMember) {
      this.foundingMemberCount++;
    }
    
    const user: User = {
      id,
      email: insertUser.email,
      passwordHash,
      authProvider: insertUser.authProvider || "local",
      providerId: insertUser.providerId || null,
      subscriptionStatus: isFoundingMember ? "free_lifetime" : "trial",
      trialEndDate: isFoundingMember ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      signupDate: new Date(),
      isFoundingMember,
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  async getUserSkinProfile(userId: string): Promise<UserSkinProfile | undefined> {
    return Array.from(this.userSkinProfiles.values()).find(profile => profile.userId === userId);
  }

  async createUserSkinProfile(insertProfile: InsertUserSkinProfile): Promise<UserSkinProfile> {
    const id = randomUUID();
    const profile: UserSkinProfile = {
      id,
      userId: insertProfile.userId,
      skinType: insertProfile.skinType ?? null,
      skinConcerns: insertProfile.skinConcerns ?? null,
      skinGoals: insertProfile.skinGoals ?? null,
      fitzpatrickScale: insertProfile.fitzpatrickScale ?? null,
      monthlyBudget: insertProfile.monthlyBudget ?? null,
      routinePreference: insertProfile.routinePreference ?? null,
      allergies: insertProfile.allergies ?? null,
      currentProducts: insertProfile.currentProducts ?? null,
      completionPercentage: insertProfile.completionPercentage,
      updatedAt: new Date(),
    };
    
    this.userSkinProfiles.set(id, profile);
    return profile;
  }

  async updateUserSkinProfile(userId: string, updates: Partial<UserSkinProfile>): Promise<UserSkinProfile | undefined> {
    const profile = await this.getUserSkinProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { 
      ...profile, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.userSkinProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async getArticles(limit: number = 20, category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values()).filter(article => article.isPublished);
    
    if (category && category !== "all") {
      articles = articles.filter(article => article.category === category);
    }
    
    return articles
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isPublished && article.isFeatured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getActiveDeals(): Promise<Deal[]> {
    const now = new Date();
    return Array.from(this.deals.values())
      .filter(deal => deal.isActive && (!deal.validUntil || deal.validUntil > now))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSavedArticles(userId: string): Promise<Article[]> {
    const savedArticleIds = Array.from(this.savedArticles.values())
      .filter(saved => saved.userId === userId)
      .map(saved => saved.articleId);
    
    return Array.from(this.articles.values())
      .filter(article => savedArticleIds.includes(article.id));
  }

  async saveArticle(data: InsertSavedArticle): Promise<SavedArticle> {
    const id = randomUUID();
    const savedArticle: SavedArticle = {
      id,
      ...data,
      savedAt: new Date(),
    };
    
    this.savedArticles.set(id, savedArticle);
    return savedArticle;
  }

  async unsaveArticle(userId: string, articleId: string): Promise<boolean> {
    const saved = Array.from(this.savedArticles.entries())
      .find(([_, savedArticle]) => 
        savedArticle.userId === userId && savedArticle.articleId === articleId
      );
    
    if (saved) {
      this.savedArticles.delete(saved[0]);
      return true;
    }
    
    return false;
  }

  async getFoundingMemberCount(): Promise<number> {
    const foundingMembers = Array.from(this.users.values())
      .filter(user => user.isFoundingMember === true);
    
    return foundingMembers.length;
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }
  
  async addToWaitingList(data: { name: string; email: string; phone?: string | null; category: string }): Promise<{ id: string }> {
    const id = randomUUID();
    const entry = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      category: data.category,
      joinedAt: new Date()
    };
    
    // In a real implementation, this would save to the database
    // For now, just returning the ID
    await db.insert(waitingList).values(entry);
    
    return { id };
  }
}

export const storage = new DatabaseStorage();
