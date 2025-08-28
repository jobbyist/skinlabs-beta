import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  authProvider: text("auth_provider").notNull().default("local"),
  googleId: text("google_id"),
  appleId: text("apple_id"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  subscriptionStatus: text("subscription_status").notNull().default("free_lifetime"),
  trialEndDate: timestamp("trial_end_date"),
  signupDate: timestamp("signup_date").notNull().default(sql`now()`),
  isFoundingMember: boolean("is_founding_member").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  registrationNumber: integer("registration_number"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const userSkinProfiles = pgTable("user_skin_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skinType: text("skin_type"), // oily, dry, combination, sensitive, normal
  skinConcerns: text("skin_concerns").array(), // acne, aging, pigmentation, sensitivity, etc.
  skinGoals: text("skin_goals").array(), // anti-aging, brightening, hydration, etc.
  fitzpatrickScale: integer("fitzpatrick_scale"), // 1-6
  monthlyBudget: integer("monthly_budget"),
  routinePreference: text("routine_preference"), // minimal, balanced, maximal
  allergies: text("allergies").array(),
  currentProducts: jsonb("current_products"),
  completionPercentage: integer("completion_percentage").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull(), // guides, ingredients, routines, reviews, deals, local_brands
  tags: text("tags").array(),
  rating: integer("rating").default(0),
  readTime: integer("read_time"), // in minutes
  readTimeMinutes: integer("read_time_minutes"), // alias for readTime
  imageUrl: text("image_url"),
  featuredImageUrl: text("featured_image_url"),
  authorId: varchar("author_id"),
  isPublished: boolean("is_published").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPremium: boolean("is_premium").notNull().default(false),
  views: integer("views").default(0),
  publishedAt: timestamp("published_at").default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const savedArticles = pgTable("saved_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  articleId: varchar("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").notNull().default(sql`now()`),
});

export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  discountPercentage: integer("discount_percentage"),
  originalPrice: integer("original_price"),
  discountedPrice: integer("discounted_price"),
  code: text("code"),
  url: text("url").notNull(),
  affiliateUrl: text("affiliate_url"),
  imageUrl: text("image_url"),
  category: text("category"), // clean_beauty, pharmacy, organic, local_brand, etc.
  isActive: boolean("is_active").notNull().default(true),
  isPremium: boolean("is_premium").notNull().default(false),
  validUntil: timestamp("valid_until"),
  expiresAt: timestamp("expires_at"), // alias for validUntil
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Additional Content Management Tables
export const webStories = pgTable("web_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  coverImage: text("cover_image").notNull(),
  slides: jsonb("slides").notNull(), // Array of slide objects with text, images, etc.
  category: text("category"),
  author: text("author"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const waitingList = pgTable("waiting_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  category: text("category").notNull().default("cashback_card"), // cashback_card, app_launch, etc.
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
});

export const diyRecipes = pgTable("diy_recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  ingredients: jsonb("ingredients").notNull(), // Array of ingredient objects
  instructions: text("instructions").array().notNull(),
  skinTypes: text("skin_types").array(), // Which skin types this recipe is for
  prepTime: integer("prep_time"), // Minutes
  difficulty: varchar("difficulty", { enum: ["easy", "medium", "hard"] }),
  featuredImage: text("featured_image"),
  images: text("images").array(),
  author: text("author"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: varchar("user_id").references(() => users.id),
  category: text("category"),
  tags: text("tags").array(),
  images: text("images").array(),
  isLocked: boolean("is_locked").default(false),
  isPinned: boolean("is_pinned").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => forumPosts.id),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  images: text("images").array(),
  parentReplyId: varchar("parent_reply_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productRecommendations = pgTable("product_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  productName: text("product_name").notNull(),
  brand: text("brand").notNull(),
  category: text("category"),
  skinTypes: text("skin_types").array(),
  skinConcerns: text("skin_concerns").array(),
  price: integer("price"), // Price in cents
  affiliateUrl: text("affiliate_url"),
  featuredImage: text("featured_image"),
  images: text("images").array(),
  rating: integer("rating"), // 1-5 stars
  pros: text("pros").array(),
  cons: text("cons").array(),
  isRecommended: boolean("is_recommended").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  signupDate: true,
});

export const insertUserSkinProfileSchema = createInsertSchema(userSkinProfiles).omit({
  id: true,
  updatedAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
});

export const insertSavedArticleSchema = createInsertSchema(savedArticles).omit({
  id: true,
  savedAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
});

// New content insert schemas
export const insertWebStorySchema = createInsertSchema(webStories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiyRecipeSchema = createInsertSchema(diyRecipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  replyCount: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductRecommendationSchema = createInsertSchema(productRecommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the Terms of Service"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const changePasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const onboardingStepSchema = z.object({
  skinType: z.enum(["oily", "dry", "combination", "sensitive", "normal"]).optional(),
  skinConcerns: z.array(z.string()).optional(),
  skinGoals: z.array(z.string()).optional(),
  fitzpatrickScale: z.number().min(1).max(6).optional(),
  monthlyBudget: z.number().min(0).optional(),
  routinePreference: z.enum(["minimal", "balanced", "maximal"]).optional(),
  allergies: z.array(z.string()).optional(),
  currentProducts: z.record(z.string(), z.any()).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserSkinProfile = typeof userSkinProfiles.$inferSelect;
export type InsertUserSkinProfile = z.infer<typeof insertUserSkinProfileSchema>;
export type Article = typeof articles.$inferSelect & {
  isSaved?: boolean; // computed property for frontend
};
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type SavedArticle = typeof savedArticles.$inferSelect;
export type InsertSavedArticle = z.infer<typeof insertSavedArticleSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

// New content types
export type WebStory = typeof webStories.$inferSelect;
export type InsertWebStory = z.infer<typeof insertWebStorySchema>;
export type DiyRecipe = typeof diyRecipes.$inferSelect;
export type InsertDiyRecipe = z.infer<typeof insertDiyRecipeSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;
export type InsertProductRecommendation = z.infer<typeof insertProductRecommendationSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type OnboardingStep = z.infer<typeof onboardingStepSchema>;

export type AuthResponse = {
  user: User;
  token: string;
};

export type SubscriptionStatus = "active" | "trial" | "expired" | "free_lifetime";
