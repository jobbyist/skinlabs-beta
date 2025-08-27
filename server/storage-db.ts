import { type User, type InsertUser, type UserSkinProfile, type InsertUserSkinProfile, type Article, type Deal, type SavedArticle, type InsertSavedArticle } from "@shared/schema";
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
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeSampleData();
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
      return user;
    } catch (error) {
      console.error("Error getting user by Google ID:", error);
      return undefined;
    }
  }

  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.appleId, appleId));
      return user;
    } catch (error) {
      console.error("Error getting user by Apple ID:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Check if this would be a founding member
      const foundingCount = await this.getFoundingMemberCount();
      const isFoundingMember = foundingCount < 1000;

      // Hash password if provided
      let passwordHash = insertUser.passwordHash;
      if (passwordHash && !passwordHash.startsWith('$2b$')) {
        passwordHash = await bcrypt.hash(passwordHash, 10);
      }

      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          passwordHash,
          isFoundingMember,
          subscriptionStatus: isFoundingMember ? "free_lifetime" : "free_lifetime",
        })
        .returning();

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user || !user.passwordHash) return null;
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      return isValid ? user : null;
    } catch (error) {
      console.error("Error verifying password:", error);
      return null;
    }
  }

  async getFoundingMemberCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isFoundingMember, true));
      return result.count;
    } catch (error) {
      console.error("Error getting founding member count:", error);
      return 0;
    }
  }

  // User skin profile
  async getUserSkinProfile(userId: string): Promise<UserSkinProfile | undefined> {
    try {
      const [profile] = await db
        .select()
        .from(userSkinProfiles)
        .where(eq(userSkinProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error("Error getting user skin profile:", error);
      return undefined;
    }
  }

  async createUserSkinProfile(insertProfile: InsertUserSkinProfile): Promise<UserSkinProfile> {
    try {
      const [profile] = await db
        .insert(userSkinProfiles)
        .values({
          ...insertProfile,
          updatedAt: new Date(),
        })
        .returning();
      return profile;
    } catch (error) {
      console.error("Error creating user skin profile:", error);
      throw error;
    }
  }

  async updateUserSkinProfile(userId: string, updates: Partial<UserSkinProfile>): Promise<UserSkinProfile | undefined> {
    try {
      const [profile] = await db
        .update(userSkinProfiles)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userSkinProfiles.userId, userId))
        .returning();
      return profile;
    } catch (error) {
      console.error("Error updating user skin profile:", error);
      return undefined;
    }
  }

  // Articles
  async getArticles(limit: number = 20, category?: string): Promise<Article[]> {
    try {
      let query = db.select().from(articles).where(eq(articles.isPublished, true));
      
      if (category && category !== "all") {
        query = query.where(eq(articles.category, category));
      }
      
      const result = await query
        .orderBy(desc(articles.createdAt))
        .limit(limit);
      
      return result;
    } catch (error) {
      console.error("Error getting articles:", error);
      return [];
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const result = await db
        .select()
        .from(articles)
        .where(and(eq(articles.isPublished, true), eq(articles.isFeatured, true)))
        .orderBy(desc(articles.createdAt))
        .limit(6);
      return result;
    } catch (error) {
      console.error("Error getting featured articles:", error);
      return [];
    }
  }

  async getArticle(id: string): Promise<Article | undefined> {
    try {
      const [article] = await db.select().from(articles).where(eq(articles.id, id));
      return article;
    } catch (error) {
      console.error("Error getting article:", error);
      return undefined;
    }
  }

  // Deals
  async getActiveDeals(): Promise<Deal[]> {
    try {
      const result = await db
        .select()
        .from(deals)
        .where(eq(deals.isActive, true))
        .orderBy(desc(deals.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting active deals:", error);
      return [];
    }
  }

  // Saved articles
  async getSavedArticles(userId: string): Promise<Article[]> {
    try {
      const result = await db
        .select({ 
          id: articles.id,
          title: articles.title,
          excerpt: articles.excerpt,
          content: articles.content,
          category: articles.category,
          tags: articles.tags,
          rating: articles.rating,
          readTime: articles.readTime,
          imageUrl: articles.imageUrl,
          authorId: articles.authorId,
          isPublished: articles.isPublished,
          isFeatured: articles.isFeatured,
          createdAt: articles.createdAt,
        })
        .from(savedArticles)
        .innerJoin(articles, eq(savedArticles.articleId, articles.id))
        .where(eq(savedArticles.userId, userId))
        .orderBy(desc(savedArticles.savedAt));
      
      return result;
    } catch (error) {
      console.error("Error getting saved articles:", error);
      return [];
    }
  }

  async saveArticle(data: InsertSavedArticle): Promise<SavedArticle> {
    try {
      const [savedArticle] = await db
        .insert(savedArticles)
        .values(data)
        .returning();
      return savedArticle;
    } catch (error) {
      console.error("Error saving article:", error);
      throw error;
    }
  }

  async unsaveArticle(userId: string, articleId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(savedArticles)
        .where(and(
          eq(savedArticles.userId, userId),
          eq(savedArticles.articleId, articleId)
        ));
      return true;
    } catch (error) {
      console.error("Error unsaving article:", error);
      return false;
    }
  }

  // Initialize sample data
  private async initializeSampleData() {
    try {
      // Check if data already exists
      const existingArticles = await db.select().from(articles).limit(1);
      if (existingArticles.length > 0) return;

      // Sample articles
      const sampleArticles = [
        {
          title: "Vitamin C: How to layer with Niacinamide",
          excerpt: "Complete guide to combining these powerhouse ingredients for maximum skin benefits.",
          content: "Detailed content about layering vitamin C and niacinamide...",
          category: "guides",
          tags: ["brightening", "beginner", "layering"],
          rating: 48,
          readTime: 5,
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
          authorId: null,
          isPublished: true,
          isFeatured: true,
        },
        {
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
        },
        {
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
        }
      ];

      await db.insert(articles).values(sampleArticles);

      // Sample deals
      const sampleDeals = [
        {
          brand: "Clere",
          title: "20% off Heritage Collection",
          description: "Celebrate local beauty with traditional-inspired formulas.",
          discountPercentage: 20,
          code: "HERITAGE20",
          url: "https://clere.co.za",
          category: "local_brand",
          isActive: true,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Clicks",
          title: "Buy 2 Get 1 Free on Suncare",
          description: "Stock up on sun protection for the whole family.",
          discountPercentage: 33,
          code: "SUN3FOR2",
          url: "https://clicks.co.za",
          category: "pharmacy",
          isActive: true,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }
      ];

      await db.insert(deals).values(sampleDeals);

    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

export const storage = new DatabaseStorage();