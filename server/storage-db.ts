import { type User, type InsertUser, type UserSkinProfile, type InsertUserSkinProfile, type Article, type Deal, type SavedArticle, type InsertSavedArticle, type WebStory, type InsertWebStory, type DiyRecipe, type InsertDiyRecipe, type ForumPost, type InsertForumPost, type ForumReply, type InsertForumReply, type ProductRecommendation, type InsertProductRecommendation } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
<<<<<<< HEAD
import { users, userSkinProfiles, articles, deals, dealLikes, savedArticles, webStories, diyRecipes, productRecommendations, waitingList } from "../shared/schema";
import { eq, and, desc, like, inArray, count, sql } from "drizzle-orm";
=======
import { users, userSkinProfiles, articles, deals, savedArticles, webStories, diyRecipes, productRecommendations, waitingList, forumTopics } from "../shared/schema";
import { eq, and, desc, like, inArray, count } from "drizzle-orm";
>>>>>>> 1976a5a3ba3e88223d15646a99b28f4bf05caa2c

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
          brand: "SMOOCH",
          title: "Honeymoon Glow Serum",
          description: "Award-winning radiance serum with vitamin C and hyaluronic acid for that honeymoon glow.",
          discountPercentage: 25,
          originalPrice: 79500, // R795.00 in cents
          discountedPrice: 59625, // R596.25 in cents
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
          brand: "AFARI",
          title: "Priming Cleanser",
          description: "2023 Beauty Awards Winner. Gentle yet effective cleanser that primes your skin for the rest of your routine.",
          discountPercentage: 20,
          originalPrice: 29500, // R295.00 in cents
          discountedPrice: 23600, // R236.00 in cents
          code: "PRIME20",
          url: "https://afaribeauty.com",
          affiliateUrl: "https://afaribeauty.com/products/priming-cleanser",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "local_brand",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "ENOUGH.",
          title: "Caffeine & Essential Oil Body Scrub",
          description: "Multi-award winning sustainable body scrub crafted from spent coffee grounds. Upcycling for a planet-first future.",
          discountPercentage: 15,
          originalPrice: 32500, // R325.00 in cents
          discountedPrice: 27625, // R276.25 in cents
          code: "SCRUB15",
          url: "https://enough.beauty",
          affiliateUrl: "https://enough.beauty/products/caffeine-body-scrub",
          imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "sustainable",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "SKOON.",
          title: "Waterless Face Wash",
          description: "Revolutionary waterless cleanser perfect for South African water scarcity. Gentle on skin, kind to the planet.",
          discountPercentage: 30,
          originalPrice: 24500, // R245.00 in cents
          discountedPrice: 17150, // R171.50 in cents
          code: "WATERLESS30",
          url: "https://skoon.world",
          affiliateUrl: "https://skoon.world/products/waterless-face-wash",
          imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "sustainable",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Standard Beauty",
          title: "The Niacinamide Serum",
          description: "10% Niacinamide serum for enlarged pores and excess oil. Clean, effective, and affordable.",
          discountPercentage: 25,
          originalPrice: 18500, // R185.00 in cents
          discountedPrice: 13875, // R138.75 in cents
          code: "NIACIN25",
          url: "https://standardbeauty.co.za",
          affiliateUrl: "https://standardbeauty.co.za/products/niacinamide-serum",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "clean_beauty",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Lumi Glo",
          title: "Vitamin C + E Brightening Cream",
          description: "Potent antioxidant cream with vitamin C and E. Perfect for brightening and protecting South African skin.",
          discountPercentage: 20,
          originalPrice: 45000, // R450.00 in cents
          discountedPrice: 36000, // R360.00 in cents
          code: "BRIGHT20",
          url: "https://lumiglo.co.za",
          affiliateUrl: "https://lumiglo.co.za/products/vitamin-c-cream",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "local_brand",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Lelive",
          title: "Hyaluronic Acid Hydrating Serum",
          description: "Intensive hydration with multiple molecular weights of hyaluronic acid. Essential for dry South African climate.",
          discountPercentage: 15,
          originalPrice: 29900, // R299.00 in cents
          discountedPrice: 25415, // R254.15 in cents
          code: "HYDRATE15",
          url: "https://lelive.co.za",
          affiliateUrl: "https://lelive.co.za/products/hyaluronic-serum",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "clean_beauty",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "African Botanics",
          title: "Marula Oil Pure Face Oil",
          description: "Premium pure marula oil from South African marula trees. Ultimate luxury for skin nourishment.",
          discountPercentage: 10,
          originalPrice: 125000, // R1250.00 in cents
          discountedPrice: 112500, // R1125.00 in cents
          code: "MARULA10",
          url: "https://africanbotanics.com",
          affiliateUrl: "https://africanbotanics.com/products/marula-oil",
          imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "luxury",
          isActive: true,
          isPremium: true,
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Clere",
          title: "Heritage Collection Body Cream",
          description: "Celebrate local beauty with traditional-inspired formulas. Rich, nourishing body cream for all skin types.",
          discountPercentage: 20,
          originalPrice: 8500, // R85.00 in cents
          discountedPrice: 6800, // R68.00 in cents
          code: "HERITAGE20",
          url: "https://clere.co.za",
          affiliateUrl: "https://clere.co.za/products/heritage-body-cream",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "local_brand",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "The Ordinary",
          title: "Retinol 0.5% in Squalane",
          description: "Available at Clicks. Proven anti-aging retinol treatment in nourishing squalane base.",
          discountPercentage: 0,
          originalPrice: 22500, // R225.00 in cents
          discountedPrice: null,
          code: null,
          url: "https://clicks.co.za",
          affiliateUrl: "https://clicks.co.za/the-ordinary-retinol",
          imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "pharmacy",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Eucerin",
          title: "Sun Care Range 30% Off",
          description: "Essential sun protection for South African conditions. Buy 2 get 1 free on selected sunscreens.",
          discountPercentage: 33,
          originalPrice: 35000, // R350.00 in cents (average)
          discountedPrice: 23450, // R234.50 in cents
          code: "SUN3FOR2",
          url: "https://clicks.co.za",
          affiliateUrl: "https://clicks.co.za/eucerin-sun-care",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "pharmacy",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Environ",
          title: "Vitamin A+ Intensive Serum",
          description: "South African developed vitamin A serum. Professional-grade skincare for advanced anti-aging.",
          discountPercentage: 15,
          originalPrice: 185000, // R1850.00 in cents
          discountedPrice: 157250, // R1572.50 in cents
          code: "VITAMINA15",
          url: "https://environ.co.za",
          affiliateUrl: "https://environ.co.za/products/vitamin-a-serum",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "professional",
          isActive: true,
          isPremium: true,
          validUntil: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Skin Ceuticals",
          title: "CE Ferulic Antioxidant Serum",
          description: "Gold standard vitamin C serum. Available at select South African stockists with professional consultation.",
          discountPercentage: 10,
          originalPrice: 295000, // R2950.00 in cents
          discountedPrice: 265500, // R2655.00 in cents
          code: "CEFER10",
          url: "https://skinceuticals.co.za",
          affiliateUrl: "https://skinceuticals.co.za/products/ce-ferulic",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "professional",
          isActive: true,
          isPremium: true,
          validUntil: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "O'Keeffe's",
          title: "Working Hands Hand Cream",
          description: "Ultimate hand repair for South African working hands. Guaranteed relief for extremely dry, cracked hands.",
          discountPercentage: 25,
          originalPrice: 12500, // R125.00 in cents
          discountedPrice: 9375, // R93.75 in cents
          code: "HANDS25",
          url: "https://clicks.co.za",
          affiliateUrl: "https://clicks.co.za/okeeffes-working-hands",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "pharmacy",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        },
        {
          brand: "Protea",
          title: "Indigenous Botanical Face Mask",
          description: "Celebrating South African flora with protea extract and rooibos. Weekly treatment for radiant skin.",
          discountPercentage: 30,
          originalPrice: 15500, // R155.00 in cents
          discountedPrice: 10850, // R108.50 in cents
          code: "PROTEA30",
          url: "https://proteabeauty.co.za",
          affiliateUrl: "https://proteabeauty.co.za/products/botanical-face-mask",
          imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "natural",
          isActive: true,
          isPremium: false,
          validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        }
      ];

      await db.insert(deals).values(sampleDeals);

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