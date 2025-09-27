import { type InsertProductRecommendation } from "@shared/schema";

export const productsSeeds: InsertProductRecommendation[] = [
  // Cleansers
  {
    title: "Best Gentle Cleanser for Sensitive Skin",
    description: "Perfect for daily use on sensitive or reactive skin. Fragrance-free and dermatologist tested.",
    productName: "CeraVe Hydrating Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    skinTypes: ["sensitive", "dry", "normal"],
    skinConcerns: ["sensitivity", "dryness"],
    price: 17500, // R175.00 in cents
    affiliateUrl: "https://clicks.co.za/cerave-hydrating-cleanser",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Gentle formula", "No fragrance", "Contains ceramides", "Available at Clicks"],
    cons: ["Can be pricey", "May not remove heavy makeup"],
    isRecommended: true
  },
  {
    title: "Top Oil Cleanser for Makeup Removal",
    description: "Effectively removes waterproof makeup and sunscreen while nourishing the skin.",
    productName: "DHC Deep Cleansing Oil",
    brand: "DHC",
    category: "cleanser",
    skinTypes: ["all"],
    skinConcerns: ["makeup removal", "blackheads"],
    price: 32000, // R320.00 in cents
    affiliateUrl: "https://takealot.com/dhc-deep-cleansing-oil",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Removes waterproof makeup", "Doesn't leave residue", "Nourishing", "Good value"],
    cons: ["Need to double cleanse", "Oil texture not for everyone"],
    isRecommended: true
  },
  {
    title: "Budget-Friendly Foaming Cleanser",
    description: "Affordable daily cleanser that effectively removes dirt and oil without stripping the skin.",
    productName: "Simple Kind to Skin Refreshing Facial Wash",
    brand: "Simple",
    category: "cleanser",
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["oiliness", "daily cleansing"],
    price: 8500, // R85.00 in cents
    affiliateUrl: "https://clicks.co.za/simple-refreshing-facial-wash",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Very affordable", "No harsh chemicals", "Available everywhere", "Good for daily use"],
    cons: ["May not be enough for very oily skin", "Basic formula"],
    isRecommended: true
  },
  {
    title: "Local Favorite Priming Cleanser",
    description: "Award-winning South African cleanser that preps skin for the rest of your routine.",
    productName: "AFARI Priming Cleanser",
    brand: "AFARI Beauty",
    category: "cleanser",
    skinTypes: ["all"],
    skinConcerns: ["texture", "dullness"],
    price: 29500, // R295.00 in cents
    affiliateUrl: "https://afaribeauty.com/products/priming-cleanser",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Made in SA", "Award-winning", "Preps skin well", "Luxury feel"],
    cons: ["Premium price", "Limited availability"],
    isRecommended: true
  },
  {
    title: "Waterless Innovation for Water-Conscious Users",
    description: "Revolutionary waterless cleanser perfect for South Africa's water challenges.",
    productName: "SKOON. Waterless Face Wash",
    brand: "SKOON.",
    category: "cleanser",
    skinTypes: ["all"],
    skinConcerns: ["sustainability", "travel"],
    price: 24500, // R245.00 in cents
    affiliateUrl: "https://skoon.world/products/waterless-face-wash",
    featuredImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Waterless formula", "Sustainable", "Travel-friendly", "Innovative"],
    cons: ["Different texture", "Learning curve", "Niche appeal"],
    isRecommended: true
  },

  // Toners/Exfoliants
  {
    title: "Gentle Chemical Exfoliant for Beginners",
    description: "Perfect introduction to chemical exfoliation with lactic acid.",
    productName: "Pixi Glow Tonic",
    brand: "Pixi",
    category: "exfoliant",
    skinTypes: ["all"],
    skinConcerns: ["dullness", "texture", "pores"],
    price: 34000, // R340.00 in cents
    affiliateUrl: "https://beautybulletin.com/pixi-glow-tonic",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Gentle formula", "Good for beginners", "Brightening", "Cult favorite"],
    cons: ["Contains alcohol", "Can be drying", "Strong fragrance"],
    isRecommended: true
  },
  {
    title: "Powerhouse BHA for Oily Skin",
    description: "2% salicylic acid liquid that unclogs pores and reduces blackheads.",
    productName: "Paula's Choice BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "exfoliant",
    skinTypes: ["oily", "combination"],
    skinConcerns: ["acne", "blackheads", "pores"],
    price: 52000, // R520.00 in cents
    affiliateUrl: "https://takealot.com/paulas-choice-bha-exfoliant",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Effective for acne", "Unclogs pores", "No fragrance", "Lightweight"],
    cons: ["Expensive", "Can cause purging", "Takes time to see results"],
    isRecommended: true
  },
  {
    title: "Affordable AHA Alternative",
    description: "Budget-friendly glycolic acid treatment for smoother skin texture.",
    productName: "The Ordinary Glycolic Acid 7% Toning Solution",
    brand: "The Ordinary",
    category: "exfoliant",
    skinTypes: ["normal", "oily"],
    skinConcerns: ["texture", "dullness", "fine lines"],
    price: 12500, // R125.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-glycolic-acid",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Very affordable", "Effective", "Available at Clicks", "Strong concentration"],
    cons: ["Can be irritating", "Strong smell", "Requires sun protection"],
    isRecommended: true
  },
  {
    title: "Gentle Hydrating Toner",
    description: "Alcohol-free toner that hydrates while preparing skin for serums.",
    productName: "Thayers Rose Petal Witch Hazel Toner",
    brand: "Thayers",
    category: "toner",
    skinTypes: ["all"],
    skinConcerns: ["hydration", "sensitivity"],
    price: 18500, // R185.00 in cents
    affiliateUrl: "https://dischem.co.za/thayers-rose-toner",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Alcohol-free", "Natural ingredients", "Hydrating", "Pleasant scent"],
    cons: ["Contains fragrance", "May not suit fragrance-sensitive skin"],
    isRecommended: true
  },

  // Serums
  {
    title: "Holy Grail Vitamin C Serum",
    description: "Stable vitamin C serum that brightens and protects against environmental damage.",
    productName: "Skinceuticals CE Ferulic",
    brand: "Skinceuticals",
    category: "serum",
    skinTypes: ["all"],
    skinConcerns: ["aging", "brightness", "environmental protection"],
    price: 165000, // R1650.00 in cents
    affiliateUrl: "https://dermastore.co.za/skinceuticals-ce-ferulic",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Gold standard", "Research-backed", "Stable formula", "Dramatic results"],
    cons: ["Very expensive", "Strong smell", "Can stain", "Limited availability"],
    isRecommended: true
  },
  {
    title: "Budget Vitamin C Alternative",
    description: "Affordable vitamin C serum with magnesium ascorbyl phosphate.",
    productName: "The Ordinary Magnesium Ascorbyl Phosphate 10%",
    brand: "The Ordinary",
    category: "serum",
    skinTypes: ["sensitive", "all"],
    skinConcerns: ["brightness", "hyperpigmentation"],
    price: 12000, // R120.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-vitamin-c",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 3,
    pros: ["Very affordable", "Gentle", "Stable", "Good for sensitive skin"],
    cons: ["Weaker than L-AA", "Slow results", "Basic packaging"],
    isRecommended: true
  },
  {
    title: "Multi-Tasking Niacinamide Serum",
    description: "10% niacinamide to reduce pores, control oil, and brighten skin.",
    productName: "The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "serum",
    skinTypes: ["oily", "combination"],
    skinConcerns: ["pores", "oiliness", "acne"],
    price: 12000, // R120.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-niacinamide",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Affordable", "Multi-tasking", "Available locally", "Fast results"],
    cons: ["Can pill", "Strong for some", "May cause breakouts initially"],
    isRecommended: true
  },
  {
    title: "Local Hero Niacinamide",
    description: "Clean formulation of niacinamide made specifically for South African skin.",
    productName: "Standard Beauty The Niacinamide Serum",
    brand: "Standard Beauty",
    category: "serum",
    skinTypes: ["oily", "combination"],
    skinConcerns: ["pores", "oiliness"],
    price: 18500, // R185.00 in cents
    affiliateUrl: "https://standardbeauty.co.za/products/niacinamide-serum",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Made in SA", "Clean formula", "Good concentration", "Local brand"],
    cons: ["More expensive than TO", "Limited distribution"],
    isRecommended: true
  },
  {
    title: "Hydration Hero for Dry Climate",
    description: "Multiple molecular weights of hyaluronic acid for intense hydration.",
    productName: "The Ordinary Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "serum",
    skinTypes: ["dry", "dehydrated", "all"],
    skinConcerns: ["dehydration", "dryness"],
    price: 11500, // R115.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-hyaluronic-acid",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Excellent hydration", "Affordable", "Lightweight", "Suits all skin types"],
    cons: ["Needs moisture to work", "Can feel sticky", "Not moisturizing alone"],
    isRecommended: true
  },
  {
    title: "Luxury Hydrating Serum",
    description: "Premium hyaluronic acid serum with additional hydrating ingredients.",
    productName: "Neutrogena Hydro Boost Serum",
    brand: "Neutrogena",
    category: "serum",
    skinTypes: ["dry", "normal"],
    skinConcerns: ["dehydration", "plumping"],
    price: 32000, // R320.00 in cents
    affiliateUrl: "https://dischem.co.za/neutrogena-hydro-boost-serum",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Good texture", "Plumping effect", "Available at pharmacies", "Pleasant feel"],
    cons: ["More expensive", "Contains fragrance", "Not as concentrated"],
    isRecommended: true
  },
  {
    title: "Award-Winning Local Serum",
    description: "Vitamin C and hyaluronic acid combination for that coveted glow.",
    productName: "SMOOCH Honeymoon Glow Serum",
    brand: "SMOOCH Beauty",
    category: "serum",
    skinTypes: ["all"],
    skinConcerns: ["dullness", "dehydration", "brightness"],
    price: 79500, // R795.00 in cents
    affiliateUrl: "https://smoochbeauty.com/products/honeymoon-glow-serum",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Award-winning", "Made in SA", "Beautiful packaging", "Effective formula"],
    cons: ["Expensive", "Limited availability", "Strong fragrance"],
    isRecommended: true
  },

  // Retinoids
  {
    title: "Beginner-Friendly Retinol",
    description: "Gentle introduction to retinoids with moisturizing base.",
    productName: "Olay Regenerist Micro-Sculpting Serum",
    brand: "Olay",
    category: "anti-aging",
    skinTypes: ["normal", "dry"],
    skinConcerns: ["aging", "fine lines"],
    price: 45000, // R450.00 in cents
    affiliateUrl: "https://dischem.co.za/olay-regenerist-serum",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Good for beginners", "Moisturizing", "Available everywhere", "Gentle"],
    cons: ["Not pure retinol", "Contains fragrance", "May be too gentle"],
    isRecommended: true
  },
  {
    title: "Pure Retinol for Advanced Users",
    description: "1% retinol in squalane for experienced retinoid users.",
    productName: "The Ordinary Retinol 1% in Squalane",
    brand: "The Ordinary",
    category: "anti-aging",
    skinTypes: ["normal", "experienced"],
    skinConcerns: ["aging", "texture", "acne"],
    price: 15500, // R155.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-retinol-1",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Pure retinol", "Affordable", "High concentration", "Squalane base"],
    cons: ["Can be irritating", "Requires experience", "Needs sun protection"],
    isRecommended: true
  },
  {
    title: "Gentle Starter Retinol",
    description: "0.2% retinol perfect for retinoid beginners.",
    productName: "The Ordinary Retinol 0.2% in Squalane",
    brand: "The Ordinary",
    category: "anti-aging",
    skinTypes: ["all", "beginner"],
    skinConcerns: ["fine lines", "texture"],
    price: 13500, // R135.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-retinol-02",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Good for beginners", "Affordable", "Gentle", "Effective concentration"],
    cons: ["May be too weak for some", "Oily texture", "Takes time to see results"],
    isRecommended: true
  },

  // Moisturizers
  {
    title: "Holy Grail Gentle Moisturizer",
    description: "Ceramide-rich moisturizer perfect for sensitive and dry skin.",
    productName: "CeraVe Daily Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    skinTypes: ["dry", "sensitive", "normal"],
    skinConcerns: ["dryness", "barrier repair"],
    price: 22000, // R220.00 in cents
    affiliateUrl: "https://clicks.co.za/cerave-daily-moisturizer",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Contains ceramides", "Non-comedogenic", "Fragrance-free", "Dermatologist developed"],
    cons: ["Can be heavy for oily skin", "Price point", "May not be enough for very dry skin"],
    isRecommended: true
  },
  {
    title: "Lightweight Gel for Oily Skin",
    description: "Oil-free gel moisturizer that hydrates without clogging pores.",
    productName: "Neutrogena Oil-Free Moisture Gel",
    brand: "Neutrogena",
    category: "moisturizer",
    skinTypes: ["oily", "combination"],
    skinConcerns: ["oiliness", "hydration"],
    price: 18500, // R185.00 in cents
    affiliateUrl: "https://dischem.co.za/neutrogena-oil-free-gel",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Lightweight", "Non-comedogenic", "Good for oily skin", "Available everywhere"],
    cons: ["May not be enough for dry areas", "Contains fragrance"],
    isRecommended: true
  },
  {
    title: "Budget-Friendly Daily Moisturizer",
    description: "Affordable daily moisturizer suitable for all skin types.",
    productName: "Simple Kind to Skin Hydrating Light Moisturiser",
    brand: "Simple",
    category: "moisturizer",
    skinTypes: ["all"],
    skinConcerns: ["daily hydration"],
    price: 9500, // R95.00 in cents
    affiliateUrl: "https://clicks.co.za/simple-light-moisturiser",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Very affordable", "Gentle", "No harsh chemicals", "Good for sensitive skin"],
    cons: ["Basic formula", "May not be enough for very dry skin"],
    isRecommended: true
  },
  {
    title: "Intensive Night Moisturizer",
    description: "Rich night moisturizer for intensive hydration and repair.",
    productName: "Olay Regenerist Night Recovery Cream",
    brand: "Olay",
    category: "moisturizer",
    skinTypes: ["dry", "mature"],
    skinConcerns: ["aging", "dryness", "repair"],
    price: 35000, // R350.00 in cents
    affiliateUrl: "https://dischem.co.za/olay-night-recovery-cream",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Rich formula", "Good for night use", "Anti-aging benefits", "Available at pharmacies"],
    cons: ["Heavy for day use", "Contains fragrance", "May be too rich for oily skin"],
    isRecommended: true
  },
  {
    title: "Hydrating Water Gel",
    description: "Lightweight water gel with hyaluronic acid for instant hydration.",
    productName: "Neutrogena Hydro Boost Water Gel",
    brand: "Neutrogena",
    category: "moisturizer",
    skinTypes: ["oily", "combination", "dehydrated"],
    skinConcerns: ["dehydration", "oiliness"],
    price: 26000, // R260.00 in cents
    affiliateUrl: "https://dischem.co.za/neutrogena-hydro-boost",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Lightweight", "Instantly hydrating", "Good for oily skin", "Contains hyaluronic acid"],
    cons: ["May not be enough for dry skin", "Price point"],
    isRecommended: true
  },

  // Sunscreens
  {
    title: "Gold Standard Face Sunscreen",
    description: "Broad-spectrum SPF 50+ with advanced UV protection technology.",
    productName: "La Roche-Posay Anthelios Ultra Light Fluid SPF 60",
    brand: "La Roche-Posay",
    category: "sunscreen",
    skinTypes: ["all"],
    skinConcerns: ["sun protection", "aging prevention"],
    price: 38000, // R380.00 in cents
    affiliateUrl: "https://clicks.co.za/la-roche-posay-anthelios",
    featuredImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["High protection", "Lightweight", "No white cast", "Water resistant"],
    cons: ["Expensive", "May sting eyes", "Strong chemical filters"],
    isRecommended: true
  },
  {
    title: "Budget-Friendly Body Sunscreen",
    description: "Affordable broad-spectrum protection for daily use.",
    productName: "Nivea Sun Protect & Moisture SPF 50+",
    brand: "Nivea",
    category: "sunscreen",
    skinTypes: ["all"],
    skinConcerns: ["sun protection", "body care"],
    price: 15000, // R150.00 in cents
    affiliateUrl: "https://clicks.co.za/nivea-sun-protect",
    featuredImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Affordable", "Large size", "Good protection", "Moisturizing"],
    cons: ["Can be greasy", "White cast", "Heavy formula"],
    isRecommended: true
  },
  {
    title: "Mineral Sunscreen for Sensitive Skin",
    description: "Zinc oxide sunscreen gentle enough for sensitive and reactive skin.",
    productName: "Eucerin Sun Sensitive Protect SPF 50+",
    brand: "Eucerin",
    category: "sunscreen",
    skinTypes: ["sensitive", "reactive"],
    skinConcerns: ["sun protection", "sensitivity"],
    price: 33000, // R330.00 in cents
    affiliateUrl: "https://clicks.co.za/eucerin-sensitive-protect",
    featuredImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Gentle formula", "Mineral filters", "Good for sensitive skin", "Dermatologist tested"],
    cons: ["Can leave white cast", "Expensive", "Thick texture"],
    isRecommended: true
  },
  {
    title: "Tinted Sunscreen for Daily Wear",
    description: "SPF 30 with light tint for even skin tone and sun protection.",
    productName: "ISDIN Fusion Water Color SPF 50",
    brand: "ISDIN",
    category: "sunscreen",
    skinTypes: ["all"],
    skinConcerns: ["sun protection", "even skin tone"],
    price: 45000, // R450.00 in cents
    affiliateUrl: "https://dermastore.co.za/isdin-fusion-water-color",
    featuredImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Light tint", "Water-based", "High protection", "Good for daily wear"],
    cons: ["Expensive", "Limited shades", "May not suit all skin tones"],
    isRecommended: true
  },

  // Eye Care
  {
    title: "Affordable Eye Cream",
    description: "Budget-friendly eye cream with peptides and caffeine.",
    productName: "The INKEY List Caffeine Eye Cream",
    brand: "The INKEY List",
    category: "eye_care",
    skinTypes: ["all"],
    skinConcerns: ["dark circles", "puffiness"],
    price: 16500, // R165.00 in cents
    affiliateUrl: "https://takealot.com/inkey-list-caffeine-eye-cream",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Affordable", "Contains caffeine", "Good texture", "Effective"],
    cons: ["Small tube", "Limited availability", "May not suit very sensitive eyes"],
    isRecommended: true
  },
  {
    title: "Luxury Anti-Aging Eye Cream",
    description: "Premium eye cream with retinol and peptides for mature skin.",
    productName: "Olay Eyes Pro-Retinol Eye Treatment",
    brand: "Olay",
    category: "eye_care",
    skinTypes: ["mature", "normal"],
    skinConcerns: ["aging", "fine lines", "wrinkles"],
    price: 28000, // R280.00 in cents
    affiliateUrl: "https://dischem.co.za/olay-eyes-pro-retinol",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Contains retinol", "Good for aging", "Available at pharmacies", "Effective formula"],
    cons: ["May be irritating", "Contains fragrance", "Price point"],
    isRecommended: true
  },

  // Masks
  {
    title: "Hydrating Sheet Masks",
    description: "Korean sheet masks with hyaluronic acid for instant hydration.",
    productName: "The Face Shop Real Nature Mask Set",
    brand: "The Face Shop",
    category: "mask",
    skinTypes: ["all"],
    skinConcerns: ["dehydration", "dullness"],
    price: 8500, // R85.00 in cents (for 5)
    affiliateUrl: "https://takealot.com/face-shop-real-nature-masks",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Good value", "Variety pack", "Instant hydration", "Fun to use"],
    cons: ["Single use", "Not environmentally friendly", "May not suit sensitive skin"],
    isRecommended: true
  },
  {
    title: "Clay Mask for Oily Skin",
    description: "Bentonite clay mask that draws out impurities and excess oil.",
    productName: "The Ordinary Salicylic Acid 2% Masque",
    brand: "The Ordinary",
    category: "mask",
    skinTypes: ["oily", "acne-prone"],
    skinConcerns: ["oiliness", "acne", "pores"],
    price: 14500, // R145.00 in cents
    affiliateUrl: "https://clicks.co.za/the-ordinary-salicylic-masque",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Effective for oily skin", "Contains salicylic acid", "Affordable", "Clarifying"],
    cons: ["Can be drying", "May cause irritation", "Strong formula"],
    isRecommended: true
  },

  // Acne Treatments
  {
    title: "Spot Treatment for Breakouts",
    description: "Benzoyl peroxide spot treatment for active breakouts.",
    productName: "Benzac AC 2.5% Gel",
    brand: "Benzac",
    category: "acne_treatment",
    skinTypes: ["oily", "acne-prone"],
    skinConcerns: ["acne", "breakouts"],
    price: 12000, // R120.00 in cents
    affiliateUrl: "https://clicks.co.za/benzac-ac-gel",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Effective for acne", "Available at pharmacies", "Good concentration", "Fast results"],
    cons: ["Can be drying", "May bleach fabrics", "Initial irritation"],
    isRecommended: true
  },
  {
    title: "Gentle Acne Treatment",
    description: "2% salicylic acid treatment gentle enough for daily use.",
    productName: "CeraVe SA Smoothing Cleanser",
    brand: "CeraVe",
    category: "acne_treatment",
    skinTypes: ["oily", "combination"],
    skinConcerns: ["acne", "texture", "pores"],
    price: 19500, // R195.00 in cents
    affiliateUrl: "https://clicks.co.za/cerave-sa-cleanser",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Gentle formula", "Contains ceramides", "Daily use", "Non-drying"],
    cons: ["May not be strong enough for severe acne", "Price point"],
    isRecommended: true
  },

  // Body Care
  {
    title: "Luxurious Body Scrub",
    description: "Upcycled coffee scrub that exfoliates and moisturizes.",
    productName: "ENOUGH. Caffeine Body Scrub",
    brand: "ENOUGH.",
    category: "body_care",
    skinTypes: ["all"],
    skinConcerns: ["texture", "dryness", "sustainability"],
    price: 32500, // R325.00 in cents
    affiliateUrl: "https://enough.beauty/products/caffeine-body-scrub",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Sustainable", "Effective exfoliation", "Moisturizing", "Award-winning"],
    cons: ["Expensive", "Can be messy", "Limited availability"],
    isRecommended: true
  },
  {
    title: "Affordable Body Moisturizer",
    description: "Budget-friendly body lotion with ceramides for dry skin.",
    productName: "CeraVe Daily Moisturizing Lotion for Body",
    brand: "CeraVe",
    category: "body_care",
    skinTypes: ["dry", "normal"],
    skinConcerns: ["dryness", "barrier repair"],
    price: 24000, // R240.00 in cents
    affiliateUrl: "https://clicks.co.za/cerave-body-lotion",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Contains ceramides", "Large size", "Good value", "Non-greasy"],
    cons: ["Basic formula", "May not be enough for very dry skin"],
    isRecommended: true
  },

  // Lip Care
  {
    title: "Healing Lip Balm",
    description: "Medicated lip balm for severely dry and cracked lips.",
    productName: "Blistex MedPlus",
    brand: "Blistex",
    category: "lip_care",
    skinTypes: ["all"],
    skinConcerns: ["dry lips", "cracked lips"],
    price: 4500, // R45.00 in cents
    affiliateUrl: "https://clicks.co.za/blistex-medplus",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Very affordable", "Medicated", "Effective", "Available everywhere"],
    cons: ["Basic packaging", "May not be enough for severe cases"],
    isRecommended: true
  },
  {
    title: "SPF Lip Protection",
    description: "Lip balm with SPF 30 for daily sun protection.",
    productName: "Nivea Sun Protect Lip Balm SPF 30",
    brand: "Nivea",
    category: "lip_care",
    skinTypes: ["all"],
    skinConcerns: ["sun protection", "lip care"],
    price: 6500, // R65.00 in cents
    affiliateUrl: "https://clicks.co.za/nivea-lip-spf30",
    featuredImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Contains SPF", "Affordable", "Good protection", "Daily use"],
    cons: ["Can be waxy", "May not be moisturizing enough"],
    isRecommended: true
  },

  // Specialized Products
  {
    title: "Pregnancy-Safe Skincare Oil",
    description: "Pure rosehip oil safe for use during pregnancy and breastfeeding.",
    productName: "Bio-Oil Skincare Oil",
    brand: "Bio-Oil",
    category: "oil",
    skinTypes: ["all"],
    skinConcerns: ["scars", "stretch marks", "aging"],
    price: 18500, // R185.00 in cents
    affiliateUrl: "https://clicks.co.za/bio-oil-skincare",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Pregnancy safe", "Multi-purpose", "Available everywhere", "Good for scars"],
    cons: ["Contains fragrance", "May be too heavy for oily skin", "Strong scent"],
    isRecommended: true
  },
  {
    title: "Natural Face Oil",
    description: "100% pure rosehip oil for natural anti-aging and repair.",
    productName: "Faithful to Nature Organic Rosehip Oil",
    brand: "Faithful to Nature",
    category: "oil",
    skinTypes: ["dry", "mature"],
    skinConcerns: ["aging", "scars", "dryness"],
    price: 28500, // R285.00 in cents
    affiliateUrl: "https://faithfultonature.co.za/organic-rosehip-oil",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["100% natural", "Organic", "Good for aging", "Multi-purpose"],
    cons: ["Can be expensive", "May not suit oily skin", "Strong smell"],
    isRecommended: true
  },

  // Men's Skincare
  {
    title: "Complete Men's Skincare Kit",
    description: "All-in-one kit with cleanser, moisturizer with SPF, and aftershave balm.",
    productName: "Nivea Men Sensitive Skin Kit",
    brand: "Nivea Men",
    category: "mens_skincare",
    skinTypes: ["sensitive", "normal"],
    skinConcerns: ["daily care", "shaving irritation"],
    price: 35000, // R350.00 in cents
    affiliateUrl: "https://clicks.co.za/nivea-men-sensitive-kit",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Complete kit", "Good for sensitive skin", "Value for money", "Available everywhere"],
    cons: ["Basic formulations", "Contains fragrance", "May not suit all skin types"],
    isRecommended: true
  },
  {
    title: "Anti-Aging for Men",
    description: "Targeted anti-aging moisturizer designed specifically for men's skin.",
    productName: "L'Oréal Men Expert Vita Lift 5 Complete",
    brand: "L'Oréal Men Expert",
    category: "mens_skincare",
    skinTypes: ["mature", "normal"],
    skinConcerns: ["aging", "firmness"],
    price: 22000, // R220.00 in cents
    affiliateUrl: "https://dischem.co.za/loreal-men-vita-lift",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Targeted for men", "Anti-aging benefits", "Available at pharmacies", "Good texture"],
    cons: ["Contains fragrance", "May be too heavy for oily skin"],
    isRecommended: true
  },

  // Teen Skincare
  {
    title: "Gentle Teen Cleanser",
    description: "Mild cleanser perfect for teenage skin dealing with hormonal changes.",
    productName: "Cetaphil Gentle Skin Cleanser",
    brand: "Cetaphil",
    category: "teen_skincare",
    skinTypes: ["sensitive", "all"],
    skinConcerns: ["teenage acne", "sensitivity"],
    price: 16500, // R165.00 in cents
    affiliateUrl: "https://clicks.co.za/cetaphil-gentle-cleanser",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Very gentle", "Good for sensitive skin", "Dermatologist recommended", "Affordable"],
    cons: ["May not remove heavy makeup", "Basic formula"],
    isRecommended: true
  },
  {
    title: "Teen Acne Treatment",
    description: "Gentle acne treatment specifically formulated for teenage skin.",
    productName: "Clean & Clear Advantage Acne Spot Treatment",
    brand: "Clean & Clear",
    category: "teen_skincare",
    skinTypes: ["oily", "acne-prone"],
    skinConcerns: ["teenage acne", "breakouts"],
    price: 8500, // R85.00 in cents
    affiliateUrl: "https://clicks.co.za/clean-clear-spot-treatment",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 3,
    pros: ["Affordable", "Targeted treatment", "Good for teens", "Available everywhere"],
    cons: ["Can be drying", "Contains alcohol", "May cause irritation"],
    isRecommended: true
  },

  // Premium/Luxury Products
  {
    title: "Luxury Vitamin C Serum",
    description: "Gold standard vitamin C serum with L-ascorbic acid, vitamin E, and ferulic acid.",
    productName: "Skinceuticals CE Ferulic",
    brand: "Skinceuticals",
    category: "luxury",
    skinTypes: ["all"],
    skinConcerns: ["aging", "brightness", "environmental protection"],
    price: 165000, // R1650.00 in cents
    affiliateUrl: "https://dermastore.co.za/skinceuticals-ce-ferulic",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Gold standard", "Clinically proven", "Stable formula", "Luxury experience"],
    cons: ["Very expensive", "Strong smell", "Can oxidize", "Limited availability"],
    isRecommended: true
  },
  {
    title: "Professional-Grade Retinol",
    description: "High-strength retinol system used by dermatologists worldwide.",
    productName: "SkinMedica Retinol Complex 1.0",
    brand: "SkinMedica",
    category: "luxury",
    skinTypes: ["experienced", "normal"],
    skinConcerns: ["advanced aging", "texture"],
    price: 125000, // R1250.00 in cents
    affiliateUrl: "https://dermastore.co.za/skinmedica-retinol-complex",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 5,
    pros: ["Professional grade", "High concentration", "Effective", "Well-formulated"],
    cons: ["Very expensive", "Requires experience", "Can cause irritation", "Limited availability"],
    isRecommended: true
  },

  // Natural/Organic Products
  {
    title: "Organic Aloe Vera Gel",
    description: "99% pure aloe vera gel for soothing and healing irritated skin.",
    productName: "Nature's Choice Aloe Vera Gel",
    brand: "Nature's Choice",
    category: "natural",
    skinTypes: ["sensitive", "all"],
    skinConcerns: ["irritation", "sunburn", "healing"],
    price: 9500, // R95.00 in cents
    affiliateUrl: "https://dischem.co.za/natures-choice-aloe-gel",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Very affordable", "Natural", "Multi-purpose", "Soothing"],
    cons: ["Can be sticky", "May not be moisturizing enough", "Basic packaging"],
    isRecommended: true
  },
  {
    title: "Natural Face Oil Blend",
    description: "Blend of argan, jojoba, and rosehip oils for natural skincare.",
    productName: "Earthsap Natural Face Oil",
    brand: "Earthsap",
    category: "natural",
    skinTypes: ["dry", "mature"],
    skinConcerns: ["dryness", "aging", "natural care"],
    price: 19500, // R195.00 in cents
    affiliateUrl: "https://dischem.co.za/earthsap-face-oil",
    featuredImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    rating: 4,
    pros: ["Natural ingredients", "Multi-oil blend", "Good value", "Made in SA"],
    cons: ["May not suit oily skin", "Can be heavy", "Strong natural scent"],
    isRecommended: true
  }
];