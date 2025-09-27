import { type InsertDeal } from "@shared/schema";

export const dealsSeeds: InsertDeal[] = [
  // Local South African Brands
  {
    brand: "SMOOCH Beauty",
    title: "Honeymoon Glow Serum - Limited Edition",
    description: "Award-winning radiance serum with vitamin C and hyaluronic acid. Get that coveted honeymoon glow with this cult-favorite serum that's taken SA by storm.",
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
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    brand: "AFARI Beauty",
    title: "Priming Cleanser - Beauty Award Winner",
    description: "2023 Beauty Awards Winner. Gentle yet effective cleanser that primes your skin for the rest of your routine. Perfect for all skin types.",
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
    validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) // 25 days from now
  },
  {
    brand: "SKOON.",
    title: "Waterless Face Wash - Revolutionary Formula",
    description: "Revolutionary waterless cleanser perfect for South African water scarcity. 100% concentrated, zero waste, maximum results.",
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
    validUntil: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000) // 35 days from now
  },
  {
    brand: "Standard Beauty",
    title: "The Niacinamide Serum - Clean Formula",
    description: "10% Niacinamide serum for enlarged pores and excess oil. Clean, effective, and affordable. No nonsense, just results.",
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
    validUntil: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 28 days from now
  },
  {
    brand: "ENOUGH.",
    title: "Caffeine Body Scrub - Award Winner",
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
    validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 days from now
  },
  {
    brand: "Lumi Glo",
    title: "Vitamin C + E Brightening Cream",
    description: "Potent antioxidant cream with vitamin C and E. Perfect for brightening and protecting South African skin from environmental damage.",
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
    validUntil: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000) // 22 days from now
  },

  // Pharmacy Partners - Clicks Deals
  {
    brand: "Clicks",
    title: "CeraVe Foaming Cleanser - 2 for 1",
    description: "Gentle foaming cleanser for normal to oily skin. Developed with dermatologists, contains 3 essential ceramides and hyaluronic acid.",
    discountPercentage: 50,
    originalPrice: 35000, // R350.00 in cents (for 2)
    discountedPrice: 17500, // R175.00 in cents
    code: "CLICKS2FOR1",
    url: "https://clicks.co.za",
    affiliateUrl: "https://clicks.co.za/cerave-foaming-cleanser",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    brand: "Clicks",
    title: "The Ordinary Niacinamide 10% + Zinc 1%",
    description: "High-strength vitamin and mineral blemish formula. Reduces the appearance of skin blemishes and congestion.",
    discountPercentage: 20,
    originalPrice: 12000, // R120.00 in cents
    discountedPrice: 9600, // R96.00 in cents
    code: "ORDINARY20",
    url: "https://clicks.co.za",
    affiliateUrl: "https://clicks.co.za/the-ordinary-niacinamide",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
  },
  {
    brand: "Clicks",
    title: "Eucerin Sun Lotion SPF 50+ - Buy 2 Save R50",
    description: "Advanced spectral technology provides superior protection against UVA/UVB and HEVIS light. Perfect for South African sun.",
    discountPercentage: 15,
    originalPrice: 66000, // R660.00 in cents (for 2)
    discountedPrice: 56100, // R561.00 in cents
    code: "EUCERIN50",
    url: "https://clicks.co.za",
    affiliateUrl: "https://clicks.co.za/eucerin-sun-lotion",
    imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) // 18 days from now
  },

  // Dis-Chem Pharmacy Deals
  {
    brand: "Dis-Chem",
    title: "Olay Regenerist Micro-Sculpting Serum",
    description: "Firming anti-aging serum with amino-peptides and niacinamide. Smooths skin texture and reduces fine lines.",
    discountPercentage: 30,
    originalPrice: 45000, // R450.00 in cents
    discountedPrice: 31500, // R315.00 in cents
    code: "OLAY30",
    url: "https://dischem.co.za",
    affiliateUrl: "https://dischem.co.za/olay-regenerist-serum",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000) // 16 days from now
  },
  {
    brand: "Dis-Chem",
    title: "Neutrogena Hydro Boost Water Gel",
    description: "Oil-free gel moisturizer with hyaluronic acid. Instantly quenches dry skin and locks in hydration for 48 hours.",
    discountPercentage: 25,
    originalPrice: 26000, // R260.00 in cents
    discountedPrice: 19500, // R195.00 in cents
    code: "HYDRO25",
    url: "https://dischem.co.za",
    affiliateUrl: "https://dischem.co.za/neutrogena-hydro-boost",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000) // 24 days from now
  },
  {
    brand: "Dis-Chem",
    title: "L'Oréal Revitalift Laser X3 Serum",
    description: "Anti-aging serum with Pro-Xylane and fragmented hyaluronic acid. Reduces wrinkles and firms skin.",
    discountPercentage: 35,
    originalPrice: 38000, // R380.00 in cents
    discountedPrice: 24700, // R247.00 in cents
    code: "LOREAL35",
    url: "https://dischem.co.za",
    affiliateUrl: "https://dischem.co.za/loreal-revitalift-serum",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
  },

  // International Brands Available in SA
  {
    brand: "Takealot",
    title: "Paula's Choice BHA Liquid Exfoliant",
    description: "2% salicylic acid liquid exfoliant removes dead skin cells and unclogs pores. Gentle daily use formula for all skin types.",
    discountPercentage: 20,
    originalPrice: 52000, // R520.00 in cents
    discountedPrice: 41600, // R416.00 in cents
    code: "PAULA20",
    url: "https://takealot.com",
    affiliateUrl: "https://takealot.com/paulas-choice-bha-exfoliant",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "international",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000) // 26 days from now
  },
  {
    brand: "Beauty Bulletin",
    title: "Pixi Glow Tonic - Glycolic Acid Toner",
    description: "5% glycolic acid toning lotion with witch hazel and aloe vera. Gently exfoliates and brightens skin tone.",
    discountPercentage: 15,
    originalPrice: 34000, // R340.00 in cents
    discountedPrice: 28900, // R289.00 in cents
    code: "PIXIGLOW15",
    url: "https://beautybulletin.com",
    affiliateUrl: "https://beautybulletin.com/pixi-glow-tonic",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "international",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000) // 19 days from now
  },

  // Seasonal Deals
  {
    brand: "Woolworths Beauty",
    title: "Summer Sun Protection Bundle",
    description: "Complete sun protection kit: SPF 50 face cream, SPF 30 body lotion, after-sun gel, and UV protection lip balm.",
    discountPercentage: 25,
    originalPrice: 58000, // R580.00 in cents
    discountedPrice: 43500, // R435.00 in cents
    code: "SUMMER25",
    url: "https://woolworths.co.za",
    affiliateUrl: "https://woolworths.co.za/summer-protection-bundle",
    imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "seasonal",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
  },
  {
    brand: "Foschini",
    title: "Hydrating Winter Skincare Set",
    description: "Winter skincare essentials: Rich moisturizer, hydrating serum, gentle cleanser, and overnight mask for dry weather protection.",
    discountPercentage: 30,
    originalPrice: 75000, // R750.00 in cents
    discountedPrice: 52500, // R525.00 in cents
    code: "WINTER30",
    url: "https://foschini.co.za",
    affiliateUrl: "https://foschini.co.za/winter-skincare-set",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "seasonal",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000) // 40 days from now
  },

  // Clean/Organic Beauty
  {
    brand: "Faithful to Nature",
    title: "Organic Rosehip Oil - Pure & Natural",
    description: "100% pure, cold-pressed rosehip oil. Rich in vitamins A and C, perfect for anti-aging and scar reduction.",
    discountPercentage: 20,
    originalPrice: 28500, // R285.00 in cents
    discountedPrice: 22800, // R228.00 in cents
    code: "ROSEHIP20",
    url: "https://faithfultonature.co.za",
    affiliateUrl: "https://faithfultonature.co.za/organic-rosehip-oil",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "organic",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000) // 33 days from now
  },
  {
    brand: "Wellness Warehouse",
    title: "Green Tea & Chamomile Face Mask Set",
    description: "Soothing sheet mask set with organic green tea and chamomile. Perfect for sensitive and irritated skin.",
    discountPercentage: 25,
    originalPrice: 16000, // R160.00 in cents
    discountedPrice: 12000, // R120.00 in cents
    code: "GREENTEA25",
    url: "https://wellnesswarehouse.com",
    affiliateUrl: "https://wellnesswarehouse.com/green-tea-mask-set",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "organic",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000) // 27 days from now
  },

  // Men's Skincare Deals
  {
    brand: "Cape Union Mart",
    title: "Men's Grooming Essentials Kit",
    description: "Complete men's skincare starter kit: face wash, moisturizer with SPF, after-shave balm, and exfoliating scrub.",
    discountPercentage: 35,
    originalPrice: 42000, // R420.00 in cents
    discountedPrice: 27300, // R273.00 in cents
    code: "MENSGROOM35",
    url: "https://capeunionmart.co.za",
    affiliateUrl: "https://capeunionmart.co.za/mens-grooming-kit",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "mens",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000) // 31 days from now
  },

  // Teen/Budget Deals
  {
    brand: "Checkers Hyper",
    title: "Student Skincare Bundle - Under R200",
    description: "Budget-friendly skincare for students: gentle cleanser, oil-free moisturizer, spot treatment, and SPF 30 sunscreen.",
    discountPercentage: 30,
    originalPrice: 25000, // R250.00 in cents
    discountedPrice: 17500, // R175.00 in cents
    code: "STUDENT30",
    url: "https://checkers.co.za",
    affiliateUrl: "https://checkers.co.za/student-skincare-bundle",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "budget",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000) // 23 days from now
  },

  // Premium/Luxury Deals
  {
    brand: "Edgars Beauty",
    title: "La Roche-Posay Effaclar Duo+ Kit",
    description: "Complete acne treatment system: purifying gel, corrective care, and SPF 30 fluid. Dermatologist recommended.",
    discountPercentage: 20,
    originalPrice: 95000, // R950.00 in cents
    discountedPrice: 76000, // R760.00 in cents
    code: "LAROCHE20",
    url: "https://edgars.co.za",
    affiliateUrl: "https://edgars.co.za/la-roche-posay-effaclar-kit",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "pharmacy",
    isActive: true,
    isPremium: true,
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
  },

  // Flash Sale
  {
    brand: "Zando Beauty",
    title: "24-Hour Flash Sale - Mixed Beauty Box",
    description: "Limited time mystery beauty box with 6+ full-size products from top international and local brands. Value over R800!",
    discountPercentage: 50,
    originalPrice: 80000, // R800.00 in cents
    discountedPrice: 40000, // R400.00 in cents
    code: "FLASH50",
    url: "https://zando.co.za",
    affiliateUrl: "https://zando.co.za/flash-beauty-box",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "flash_sale",
    isActive: true,
    isPremium: false,
    validUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
  }
];