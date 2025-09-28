# Testing the Database Migration and Seeding System

## Prerequisites

1. Set up a PostgreSQL database (local or cloud)
2. Copy `.env.example` to `.env` and update DATABASE_URL

## Test Steps

### 1. Generate Initial Migration
```bash
npm run db:generate
```
This should create migration files in the `/migrations` directory.

### 2. Apply Migration
```bash  
npm run db:migrate
```
This creates all the tables in your database.

### 3. Seed Database
```bash
npm run db:seed
```
This populates the database with:
- 50+ skincare articles
- 100+ product recommendations  
- 20+ current deals

### 4. Verify Data

Check that the data was inserted correctly:

**Articles**: Should have 50+ articles with categories like "guides", "ingredients", "routines", "local_brands"
**Deals**: Should have 20+ deals from retailers like Clicks, Dis-Chem, SMOOCH, AFARI, etc.
**Products**: Should have 100+ product recommendations with ratings, prices, and affiliate URLs

### 5. Test API Endpoints

If you run the development server with proper environment variables:

```bash
npm run dev
```

You should be able to access:
- `GET /api/articles` - All articles
- `GET /api/articles/featured` - Featured articles only
- `GET /api/deals` - Active deals
- `GET /api/product-recommendations` - Product recommendations

### 6. Test Frontend Integration

The homepage should now display:
- Featured Articles section (3 articles)
- Current Deals section (6 deals)
- Product Recommendations section (6 products)

The Skincare Guides page should show all articles in the "guides" category.

## Expected Results

After successful seeding, you should have a fully populated SkinLabs platform with comprehensive South African skincare content, ready for production use.