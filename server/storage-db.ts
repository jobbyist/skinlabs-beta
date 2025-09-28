import { type User, type InsertUser, type UserSkinProfile, type InsertUserSkinProfile, type Article, type Deal, type SavedArticle, type InsertSavedArticle, type WebStory, type InsertWebStory, type DiyRecipe, type InsertDiyRecipe, type ForumPost, type InsertForumPost, type ForumReply, type InsertForumReply, type ProductRecommendation, type InsertProductRecommendation } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users, userSkinProfiles, articles, deals, savedArticles, webStories, diyRecipes, productRecommendations, waitingList, forumTopics } from "../shared/schema";
import { eq, and, desc, like, inArray, count, sql } from "drizzle-orm";

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
  likeDeal(dealId: string, userId: string, isLike: boolean): Promise<void>;
  removeDealLike(dealId: string, userId: string): Promise<void>;
  
  // Saved articles
  getSavedArticles(userId: string): Promise<Article[]>;
  saveArticle(data: InsertSavedArticle): Promise<SavedArticle>;
  unsaveArticle(userId: string, articleId: string): Promise<boolean>;
  
  // Founding member tracking
  getFoundingMemberCount(): Promise<number>;
  getUserCount(): Promise<number>;
  
  // Waiting list
  addToWaitingList(data: { name: string; email: string; phone?: string | null; category: string }): Promise<{ id: string }>;

  // Content Management for Automation
  // Articles
  getAllArticles(): Promise<Article[]>;
  createArticle(article: any): Promise<Article>;
  updateArticle(id: string, updates: any): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<void>;

  // Web Stories
  getAllWebStories(): Promise<WebStory[]>;
  createWebStory(story: any): Promise<WebStory>;
  updateWebStory(id: string, updates: any): Promise<WebStory | undefined>;
  deleteWebStory(id: string): Promise<void>;

  // DIY Recipes
  getAllDiyRecipes(): Promise<DiyRecipe[]>;
  createDiyRecipe(recipe: any): Promise<DiyRecipe>;

  // Forum Posts
  getAllForumPosts(): Promise<ForumPost[]>;
  createForumPost(post: any): Promise<ForumPost>;

  // Product Recommendations
  getAllProductRecommendations(): Promise<ProductRecommendation[]>;
  createProductRecommendation(product: any): Promise<ProductRecommendation>;
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
      // Hash password if provided
      let passwordHash = insertUser.passwordHash;
      if (passwordHash && !passwordHash.startsWith('$2b$')) {
        passwordHash = await bcrypt.hash(passwordHash, 10);
      }

      // Use the subscription logic from the routes, don't override it here
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          passwordHash,
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

  async getUserCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: count() })
        .from(users);
      return result.count;
    } catch (error) {
      console.error("Error getting user count:", error);
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
      let whereConditions = [eq(articles.isPublished, true)];
      
      if (category && category !== "all") {
        whereConditions.push(eq(articles.category, category));
      }
      
      const result = await db
        .select()
        .from(articles)
        .where(and(...whereConditions))
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

  async likeDeal(dealId: string, userId: string, isLike: boolean): Promise<void> {
    try {
      // First check if user already has a reaction to this deal
      const existingReaction = await db
        .select()
        .from(dealLikes)
        .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.userId, userId)))
        .limit(1);

      if (existingReaction.length > 0) {
        // Update existing reaction
        await db
          .update(dealLikes)
          .set({ isLike })
          .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.userId, userId)));
      } else {
        // Create new reaction
        await db.insert(dealLikes).values({
          dealId,
          userId,
          isLike,
        });
      }

      // Update deal like/dislike counts
      const likesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(dealLikes)
        .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.isLike, true)));

      const dislikesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(dealLikes)
        .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.isLike, false)));

      await db
        .update(deals)
        .set({
          likes: likesCount[0]?.count || 0,
          dislikes: dislikesCount[0]?.count || 0,
        })
        .where(eq(deals.id, dealId));

    } catch (error) {
      console.error("Error liking/disliking deal:", error);
      throw error;
    }
  }

  async removeDealLike(dealId: string, userId: string): Promise<void> {
    try {
      await db
        .delete(dealLikes)
        .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.userId, userId)));

      // Update deal like/dislike counts
      const likesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(dealLikes)
        .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.isLike, true)));

      const dislikesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(dealLikes)
        .where(and(eq(dealLikes.dealId, dealId), eq(dealLikes.isLike, false)));

      await db
        .update(deals)
        .set({
          likes: likesCount[0]?.count || 0,
          dislikes: dislikesCount[0]?.count || 0,
        })
        .where(eq(deals.id, dealId));

    } catch (error) {
      console.error("Error removing deal like:", error);
      throw error;
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

  // Initialize sample data - NOTE: For comprehensive seeding, use the dedicated seed script
  private async initializeSampleData() {
    try {
      // Check if data already exists
      const existingArticles = await db.select().from(articles).limit(1);
      if (existingArticles.length > 0) {
        console.log("Sample data already exists. Use 'npm run db:seed' for comprehensive seeding.");
        return;
      }

      console.log("No existing data found. For comprehensive seeding with 50+ articles, 20+ deals, and 100+ products, run: npm run db:seed");
      console.log("Initializing minimal sample data for immediate functionality...");

      // Minimal sample data for basic functionality
      const sampleArticles = [
        {
          title: "Getting Started with Skincare in South Africa",
          excerpt: "Essential guide to building your first skincare routine in South African conditions.",
          content: "South Africa's unique climate and UV levels require specific skincare approaches. This guide covers the basics of building an effective routine with locally available products...",
          category: "guides",
          tags: ["beginner", "south africa", "basics"],
          rating: 85,
          readTime: 5,
          featuredImageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          isPublished: true,
          isFeatured: true,
        },
        {
          title: "Sun Protection Essentials for African Skin",
          excerpt: "Why SPF is non-negotiable in South Africa and how to choose the right sunscreen.",
          content: "With some of the highest UV levels globally, South Africa requires serious sun protection. Learn about SPF selection for all skin tones...",
          category: "guides",
          tags: ["sun protection", "spf", "african skin"],
          rating: 92,
          readTime: 7,
          featuredImageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          isPublished: true,
          isFeatured: true,
        }
      ];

      await db.insert(articles).values(sampleArticles);

      // Minimal sample deals
      const sampleDeals = [
        {
          brand: "SMOOCH Beauty",
          title: "Honeymoon Glow Serum",
          description: "Award-winning radiance serum with vitamin C and hyaluronic acid.",
          discountPercentage: 25,
          originalPrice: 79500,
          discountedPrice: 59625,
          code: "GLOW25",
          url: "https://smoochbeauty.com",
          affiliateUrl: "https://smoochbeauty.com/products/honeymoon-glow-serum",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "local_brand",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Clicks",
          title: "CeraVe Foaming Cleanser - 2 for 1",
          description: "Gentle foaming cleanser for normal to oily skin. Developed with dermatologists.",
          discountPercentage: 50,
          originalPrice: 35000,
          discountedPrice: 17500,
          code: "CLICKS2FOR1",
          url: "https://clicks.co.za",
          affiliateUrl: "https://clicks.co.za/cerave-foaming-cleanser",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "pharmacy",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }
      ];

      await db.insert(deals).values(sampleDeals);

      console.log("✅ Minimal sample data initialized successfully!");
      console.log("🌱 For complete seed data (50+ articles, 20+ deals, 100+ products), run: npm run db:seed");

    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }

  // =====================
  // CONTENT MANAGEMENT METHODS
  // =====================

  // Articles
  async getAllArticles(): Promise<Article[]> {
    try {
      return await db.select().from(articles).orderBy(desc(articles.publishedAt));
    } catch (error) {
      console.error("Error getting all articles:", error);
      return [];
    }
  }

  async createArticle(articleData: any): Promise<Article> {
    try {
      const [article] = await db.insert(articles).values({
        ...articleData,
        publishedAt: articleData.publishedAt || new Date(),
        createdAt: new Date(),
      }).returning();
      return article;
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  }

  async updateArticle(id: string, updates: any): Promise<Article | undefined> {
    try {
      const [article] = await db
        .update(articles)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(articles.id, id))
        .returning();
      return article;
    } catch (error) {
      console.error("Error updating article:", error);
      return undefined;
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      await db.delete(articles).where(eq(articles.id, id));
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  }

  // Web Stories
  async getAllWebStories(): Promise<WebStory[]> {
    try {
      return await db.select().from(webStories)
        .where(eq(webStories.isPublished, true))
        .orderBy(desc(webStories.publishedAt));
    } catch (error) {
      console.error("Error getting web stories:", error);
      return [];
    }
  }

  async createWebStory(storyData: any): Promise<WebStory> {
    try {
      const [story] = await db.insert(webStories).values({
        ...storyData,
        publishedAt: storyData.publishedAt || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return story;
    } catch (error) {
      console.error("Error creating web story:", error);
      throw error;
    }
  }

  async updateWebStory(id: string, updates: any): Promise<WebStory | undefined> {
    try {
      const [story] = await db
        .update(webStories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(webStories.id, id))
        .returning();
      return story;
    } catch (error) {
      console.error("Error updating web story:", error);
      return undefined;
    }
  }

  async deleteWebStory(id: string): Promise<void> {
    try {
      await db.delete(webStories).where(eq(webStories.id, id));
    } catch (error) {
      console.error("Error deleting web story:", error);
      throw error;
    }
  }

  // DIY Recipes
  async getAllDiyRecipes(): Promise<DiyRecipe[]> {
    try {
      return await db.select().from(diyRecipes)
        .where(eq(diyRecipes.isPublished, true))
        .orderBy(desc(diyRecipes.publishedAt));
    } catch (error) {
      console.error("Error getting DIY recipes:", error);
      return [];
    }
  }

  async createDiyRecipe(recipeData: any): Promise<DiyRecipe> {
    try {
      const [recipe] = await db.insert(diyRecipes).values({
        ...recipeData,
        publishedAt: recipeData.publishedAt || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return recipe;
    } catch (error) {
      console.error("Error creating DIY recipe:", error);
      throw error;
    }
  }

  // Forum Posts
  async getAllForumPosts(): Promise<ForumPost[]> {
    try {
      return await db.select().from(forumTopics)
        .orderBy(desc(forumTopics.isSticky), desc(forumTopics.lastReplyAt), desc(forumTopics.createdAt));
    } catch (error) {
      console.error("Error getting forum posts:", error);
      return [];
    }
  }

  async createForumPost(postData: any): Promise<ForumPost> {
    try {
      const [post] = await db.insert(forumTopics).values({
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return post;
    } catch (error) {
      console.error("Error creating forum post:", error);
      throw error;
    }
  }

  // Product Recommendations
  async getAllProductRecommendations(): Promise<ProductRecommendation[]> {
    try {
      return await db.select().from(productRecommendations)
        .where(eq(productRecommendations.isRecommended, true))
        .orderBy(desc(productRecommendations.createdAt));
    } catch (error) {
      console.error("Error getting product recommendations:", error);
      return [];
    }
  }

  async createProductRecommendation(productData: any): Promise<ProductRecommendation> {
    try {
      const [product] = await db.insert(productRecommendations).values({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return product;
    } catch (error) {
      console.error("Error creating product recommendation:", error);
      throw error;
    }
  }

  // Waiting list
  async addToWaitingList(data: { name: string; email: string; phone?: string | null; category: string }): Promise<{ id: string }> {
    try {
      const [entry] = await db.insert(waitingList).values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        category: data.category
      }).returning();
      return { id: entry.id };
    } catch (error) {
      console.error("Error adding to waiting list:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();