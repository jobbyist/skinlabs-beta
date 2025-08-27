import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  authProvider: text("auth_provider").notNull().default("local"),
  providerId: text("provider_id"),
  subscriptionStatus: text("subscription_status").notNull().default("free_lifetime"),
  trialEndDate: timestamp("trial_end_date"),
  signupDate: timestamp("signup_date").notNull().default(sql`now()`),
  isFoundingMember: boolean("is_founding_member").notNull().default(false),
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
  imageUrl: text("image_url"),
  authorId: varchar("author_id"),
  isPublished: boolean("is_published").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
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
  code: text("code"),
  url: text("url").notNull(),
  category: text("category"), // clean_beauty, pharmacy, organic, local_brand, etc.
  isActive: boolean("is_active").notNull().default(true),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
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

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
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
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type SavedArticle = typeof savedArticles.$inferSelect;
export type InsertSavedArticle = z.infer<typeof insertSavedArticleSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type OnboardingStep = z.infer<typeof onboardingStepSchema>;

export type AuthResponse = {
  user: User;
  token: string;
};

export type SubscriptionStatus = "active" | "trial" | "expired" | "free_lifetime";
