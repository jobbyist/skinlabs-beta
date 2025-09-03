import { type User, type InsertUser, type UserSkinProfile, type InsertUserSkinProfile, type Article, type Deal, type SavedArticle, type InsertSavedArticle, waitingList } from "@shared/schema";
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


  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.appleId, appleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const passwordHash = insertUser.passwordHash ? await bcrypt.hash(insertUser.passwordHash, 10) : null;
    
    // First 1000 users get founding member status and free lifetime
    const foundingMemberCount = await this.getFoundingMemberCount();
    const isFoundingMember = foundingMemberCount < 1000;
    
    const userData = {
      ...insertUser,
      passwordHash,
      subscriptionStatus: isFoundingMember ? "free_lifetime" as const : "trial" as const,
      trialEndDate: isFoundingMember ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isFoundingMember,
    };
    
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.passwordHash) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  async getUserSkinProfile(userId: string): Promise<UserSkinProfile | undefined> {
    const [profile] = await db.select().from(userSkinProfiles).where(eq(userSkinProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserSkinProfile(insertProfile: InsertUserSkinProfile): Promise<UserSkinProfile> {
    const [profile] = await db.insert(userSkinProfiles).values({
      ...insertProfile,
      completionPercentage: insertProfile.completionPercentage || 0,
    }).returning();
    return profile;
  }

  async updateUserSkinProfile(userId: string, updates: Partial<UserSkinProfile>): Promise<UserSkinProfile | undefined> {
    const [profile] = await db.update(userSkinProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSkinProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async getArticles(limit: number = 20, category?: string): Promise<Article[]> {
    let query = db.select().from(articles).where(eq(articles.isPublished, true));
    
    if (category && category !== "all") {
      query = query.where(eq(articles.category, category));
    }
    
    const result = await query.orderBy(desc(articles.createdAt)).limit(limit);
    return result;
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const result = await db.select().from(articles)
      .where(and(eq(articles.isPublished, true), eq(articles.isFeatured, true)))
      .orderBy(desc(articles.createdAt));
    return result;
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getActiveDeals(): Promise<Deal[]> {
    const now = new Date();
    const result = await db.select().from(deals)
      .where(eq(deals.isActive, true))
      .orderBy(desc(deals.createdAt));
    
    // Filter out expired deals in application logic since we can't easily do date comparison in SQL
    return result.filter(deal => !deal.validUntil || deal.validUntil > now);
  }

  async getSavedArticles(userId: string): Promise<Article[]> {
    const result = await db.select({
      id: articles.id,
      title: articles.title,
      excerpt: articles.excerpt,
      content: articles.content,
      category: articles.category,
      tags: articles.tags,
      rating: articles.rating,
      readTime: articles.readTime,
      readTimeMinutes: articles.readTimeMinutes,
      imageUrl: articles.imageUrl,
      featuredImageUrl: articles.featuredImageUrl,
      authorId: articles.authorId,
      isPublished: articles.isPublished,
      isFeatured: articles.isFeatured,
      isPremium: articles.isPremium,
      views: articles.views,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
    })
    .from(savedArticles)
    .innerJoin(articles, eq(savedArticles.articleId, articles.id))
    .where(eq(savedArticles.userId, userId))
    .orderBy(desc(savedArticles.savedAt));
    
    return result;
  }

  async saveArticle(data: InsertSavedArticle): Promise<SavedArticle> {
    const [savedArticle] = await db.insert(savedArticles).values(data).returning();
    return savedArticle;
  }

  async unsaveArticle(userId: string, articleId: string): Promise<boolean> {
    const result = await db.delete(savedArticles)
      .where(and(eq(savedArticles.userId, userId), eq(savedArticles.articleId, articleId)));
    
    return result.rowCount > 0;
  }

  async getFoundingMemberCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users).where(eq(users.isFoundingMember, true));
    return result.count;
  }

  async getUserCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users);
    return result.count;
  }
  
  async addToWaitingList(data: { name: string; email: string; phone?: string | null; category: string }): Promise<{ id: string }> {
    const [entry] = await db.insert(waitingList).values(data).returning({ id: waitingList.id });
    return { id: entry.id };
  }
}

export const storage = new DatabaseStorage();
