#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { articles, deals, productRecommendations } from "../shared/schema";
import { articlesSeeds } from "../seeds/articles";
import { dealsSeeds } from "../seeds/deals";
import { productsSeeds } from "../seeds/products";
import { eq, count } from "drizzle-orm";

// Database setup
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Check existing data
    const [existingArticles] = await db.select({ count: count() }).from(articles);
    const [existingDeals] = await db.select({ count: count() }).from(deals);
    const [existingProducts] = await db.select({ count: count() }).from(productRecommendations);

    console.log(`📊 Current data counts:`);
    console.log(`   Articles: ${existingArticles.count}`);
    console.log(`   Deals: ${existingDeals.count}`);
    console.log(`   Products: ${existingProducts.count}`);

    // Seed Articles (50+ guides and articles)
    if (existingArticles.count === 0) {
      console.log("📝 Seeding articles...");
      
      // Insert articles in batches to avoid potential memory issues
      const batchSize = 10;
      for (let i = 0; i < articlesSeeds.length; i += batchSize) {
        const batch = articlesSeeds.slice(i, i + batchSize);
        await db.insert(articles).values(batch);
        console.log(`   Inserted articles batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(articlesSeeds.length / batchSize)}`);
      }
      
      console.log(`✅ Successfully seeded ${articlesSeeds.length} articles`);
    } else {
      console.log("📝 Articles already exist, skipping...");
    }

    // Seed Deals (20+ current deals)
    if (existingDeals.count === 0) {
      console.log("💰 Seeding deals...");
      await db.insert(deals).values(dealsSeeds);
      console.log(`✅ Successfully seeded ${dealsSeeds.length} deals`);
    } else {
      console.log("💰 Deals already exist, skipping...");
    }

    // Seed Product Recommendations (100+ products)
    if (existingProducts.count === 0) {
      console.log("🛍️  Seeding product recommendations...");
      
      // Insert products in batches to avoid potential memory issues
      const batchSize = 20;
      for (let i = 0; i < productsSeeds.length; i += batchSize) {
        const batch = productsSeeds.slice(i, i + batchSize);
        await db.insert(productRecommendations).values(batch);
        console.log(`   Inserted products batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsSeeds.length / batchSize)}`);
      }
      
      console.log(`✅ Successfully seeded ${productsSeeds.length} product recommendations`);
    } else {
      console.log("🛍️  Product recommendations already exist, skipping...");
    }

    // Final counts
    const [finalArticles] = await db.select({ count: count() }).from(articles);
    const [finalDeals] = await db.select({ count: count() }).from(deals);
    const [finalProducts] = await db.select({ count: count() }).from(productRecommendations);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`📊 Final data counts:`);
    console.log(`   Articles: ${finalArticles.count}`);
    console.log(`   Deals: ${finalDeals.count}`);
    console.log(`   Products: ${finalProducts.count}`);
    console.log(`   Total records: ${finalArticles.count + finalDeals.count + finalProducts.count}`);

    // Verify seed data quality
    console.log("\n🔍 Verifying seed data quality...");
    
    // Check for featured articles (should be displayed on homepage)
    const featuredArticles = await db.select().from(articles).where(eq(articles.isFeatured, true));
    console.log(`   Featured articles: ${featuredArticles.length}`);
    
    // Check for guides category articles (should be displayed on Guides page)
    const guidesArticles = await db.select().from(articles).where(eq(articles.category, "guides"));
    console.log(`   Guides articles: ${guidesArticles.length}`);
    
    // Check for active deals (should be displayed on homepage)
    const activeDeals = await db.select().from(deals).where(eq(deals.isActive, true));
    console.log(`   Active deals: ${activeDeals.length}`);
    
    // Check for recommended products (should be displayed on homepage)
    const recommendedProducts = await db.select().from(productRecommendations).where(eq(productRecommendations.isRecommended, true));
    console.log(`   Recommended products: ${recommendedProducts.length}`);

    console.log("\n✨ Seed data verification complete. Database is ready for use!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase().then(() => {
  console.log("🏁 Seeding process finished.");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Fatal error during seeding:", error);
  process.exit(1);
});