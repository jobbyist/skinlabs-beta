import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-db";
import { setupAuth, requireAuth, optionalAuth, generateToken } from "./auth";
import jwt from "jsonwebtoken";
import passport from "passport";
import { loginSchema, registerSchema, resetPasswordSchema, changePasswordSchema, onboardingStepSchema } from "@shared/schema";
import { z } from "zod";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { sendTrialExpirationNotification } from "./sendgrid";
import { chatWithSKYNN } from "./openai";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    (req as any).user = decoded;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  setupAuth(app);
  
  // Waiting List API
  app.post('/api/waiting-list', async (req: Request, res: Response) => {
    try {
      const { name, email, phone, category } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ 
          message: "Name and email are required" 
        });
      }
      
      const entry = await storage.addToWaitingList({
        name,
        email,
        phone,
        category: category || 'cashback_card'
      });
      
      res.json({ 
        message: "Successfully added to waiting list",
        id: entry.id 
      });
    } catch (error) {
      console.error("Error adding to waiting list:", error);
      res.status(500).json({ 
        message: "Failed to add to waiting list" 
      });
    }
  });
  
  // Poll API
  app.get('/api/poll/current', authenticateToken, async (req: Request, res: Response) => {
    // Mock poll data - in production, this would come from the database
    const poll = {
      id: "poll-1",
      question: "What's your favourite, must-have skincare product right now?",
      options: [
        { id: "1", text: "SKOON. Skincare", votes: 245 },
        { id: "2", text: "Standard Beauty", votes: 189 },
        { id: "3", text: "Lumi Glo", votes: 156 },
        { id: "4", text: "Lelive", votes: 134 },
        { id: "5", text: "African Botanics", votes: 98 }
      ],
      totalVotes: 822,
      hasVoted: false // Would check if user has voted
    };
    
    res.json(poll);
  });
  
  app.post('/api/poll/vote', authenticateToken, async (req: Request, res: Response) => {
    const { optionId } = req.body;
    
    // In production, save the vote to database and prevent duplicate voting
    res.json({ message: "Vote recorded successfully" });
  });
  
  // AI Chat API
  app.post('/api/chat/skynn', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const userId = (req as any).user?.userId;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await chatWithSKYNN(message, userId);
      res.json({ response });
    } catch (error) {
      console.error("Error in SKYNN chat:", error);
      res.status(500).json({ message: "Failed to get response from SKYNN AI" });
    }
  });

  // Local registration with user count-based subscription logic
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, acceptTerms } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Get current user count to determine subscription logic
      const userCount = await storage.getUserCount();
      const registrationNumber = userCount + 1;
      
      let subscriptionStatus = "free";
      let isFoundingMember = false;
      let trialEndDate = null;
      let requiresPayment = false;
      
      if (registrationNumber <= 100) {
        // Users 1-100 are founding members with free lifetime access
        subscriptionStatus = "free_lifetime";
        isFoundingMember = true;
      } else if (registrationNumber <= 1000) {
        // Users 101-1000 get 30-day free trial
        subscriptionStatus = "trial";
        trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 30);
      } else {
        // Users 1001+ must pay before account creation
        requiresPayment = true;
        subscriptionStatus = "pending_payment";
      }
      
      // If payment is required, don't create the user yet - return payment info
      if (requiresPayment) {
        return res.status(402).json({
          message: 'Payment required',
          requiresPayment: true,
          amount: '9.99',
          currency: 'USD',
          registrationNumber
        });
      }
      
      // Create user with appropriate subscription status
      const user = await storage.createUser({
        email,
        passwordHash: password, // This will be hashed in storage
        authProvider: "local",
        subscriptionStatus,
        trialEndDate,
        isFoundingMember,
        registrationNumber
      });
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
          isFoundingMember: user.isFoundingMember,
          trialEndDate: user.trialEndDate,
          registrationNumber: user.registrationNumber
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
          isFoundingMember: user.isFoundingMember,
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Google OAuth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/?error=auth' }),
    (req: Request, res: Response) => {
      const user = req.user as any;
      const token = generateToken(user);
      
      // Redirect to frontend with token
      res.redirect(`/?token=${token}&auth=success`);
    }
  );

  // Apple OAuth routes (when configured)
  app.get('/api/auth/apple',
    passport.authenticate('apple')
  );

  app.post('/api/auth/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/?error=auth' }),
    (req: Request, res: Response) => {
      const user = req.user as any;
      const token = generateToken(user);
      
      // Redirect to frontend with token
      res.redirect(`/?token=${token}&auth=success`);
    }
  );

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        isFoundingMember: user.isFoundingMember,
        trialEndDate: user.trialEndDate,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // User skin profile routes
  app.get('/api/user/skin-profile', authenticateToken, async (req: Request, res: Response) => {
    try {
      const profile = await storage.getUserSkinProfile(req.user.userId);
      res.json(profile || null);
    } catch (error) {
      console.error('Get skin profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/user/skin-profile', authenticateToken, async (req: Request, res: Response) => {
    try {
      const profileData = onboardingStepSchema.parse(req.body);
      
      const existingProfile = await storage.getUserSkinProfile(req.user.userId);
      
      let profile;
      if (existingProfile) {
        // Calculate completion percentage
        const fields = ['skinType', 'skinConcerns', 'skinGoals', 'fitzpatrickScale', 'monthlyBudget', 'routinePreference'];
        const completedFields = fields.filter(field => 
          profileData[field as keyof typeof profileData] !== undefined && 
          profileData[field as keyof typeof profileData] !== null
        ).length;
        const completionPercentage = Math.round((completedFields / fields.length) * 100);
        
        profile = await storage.updateUserSkinProfile(req.user.userId, {
          ...profileData,
          completionPercentage,
        });
      } else {
        profile = await storage.createUserSkinProfile({
          userId: req.user.userId,
          ...profileData,
          completionPercentage: 20, // Initial step
        });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Update skin profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Articles routes
  app.get('/api/articles', async (req: Request, res: Response) => {
    try {
      const { limit, category } = req.query;
      const articles = await storage.getArticles(
        limit ? parseInt(limit as string) : 20,
        category as string
      );
      res.json(articles);
    } catch (error) {
      console.error('Get articles error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/articles/featured', async (req: Request, res: Response) => {
    try {
      const articles = await storage.getFeaturedArticles();
      res.json(articles);
    } catch (error) {
      console.error('Get featured articles error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/articles/:id', async (req: Request, res: Response) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      res.json(article);
    } catch (error) {
      console.error('Get article error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Deals routes
  app.get('/api/deals', async (req: Request, res: Response) => {
    try {
      const deals = await storage.getActiveDeals();
      res.json(deals);
    } catch (error) {
      console.error('Get deals error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Saved articles routes
  app.get('/api/user/saved-articles', authenticateToken, async (req: Request, res: Response) => {
    try {
      const articles = await storage.getSavedArticles(req.user.userId);
      res.json(articles);
    } catch (error) {
      console.error('Get saved articles error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/user/save-article', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { articleId } = req.body;
      
      if (!articleId) {
        return res.status(400).json({ message: 'Article ID is required' });
      }
      
      const article = await storage.getArticle(articleId);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      const savedArticle = await storage.saveArticle({
        userId: req.user.userId,
        articleId,
      });
      
      res.status(201).json(savedArticle);
    } catch (error) {
      console.error('Save article error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/user/save-article/:articleId', authenticateToken, async (req: Request, res: Response) => {
    try {
      const success = await storage.unsaveArticle(req.user.userId, req.params.articleId);
      
      if (!success) {
        return res.status(404).json({ message: 'Saved article not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Unsave article error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // PayPal routes for subscription management
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Complete registration with payment
  app.post('/api/auth/register-with-payment', async (req: Request, res: Response) => {
    try {
      const { email, password, acceptTerms, paypalOrderId } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Verify PayPal payment was captured successfully
      // In production, you would verify the order status with PayPal
      
      // Get current user count
      const userCount = await storage.getUserCount();
      const registrationNumber = userCount + 1;
      
      // Create user with active subscription (payment completed)
      const user = await storage.createUser({
        email,
        passwordHash: password,
        authProvider: "local",
        subscriptionStatus: "active",
        isFoundingMember: false,
        registrationNumber
      });
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
          isFoundingMember: user.isFoundingMember,
          registrationNumber: user.registrationNumber
        },
        token
      });
    } catch (error) {
      console.error('Registration with payment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Subscription upgrade for trial users
  app.post('/api/subscription/upgrade', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { paypalOrderId } = req.body;
      
      // Verify payment was completed successfully
      // In production, verify the PayPal order status
      
      const user = await storage.updateUser(req.user.userId, {
        subscriptionStatus: "active",
        trialEndDate: null,
      });
      
      res.json({
        message: 'Subscription upgraded successfully',
        subscriptionStatus: user?.subscriptionStatus,
      });
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get user registration count (for frontend display)
  app.get('/api/user/registration-info', async (req: Request, res: Response) => {
    try {
      const userCount = await storage.getUserCount();
      const nextRegistrationNumber = userCount + 1;
      
      let subscriptionInfo = {};
      
      if (nextRegistrationNumber <= 100) {
        subscriptionInfo = {
          tier: 'trial',
          message: `You'll be user #${nextRegistrationNumber} and get a 30-day free trial!`,
          requiresPayment: false
        };
      } else if (nextRegistrationNumber <= 1000) {
        subscriptionInfo = {
          tier: 'founding_member',
          message: `You'll be founding member #${nextRegistrationNumber - 100} with free lifetime access!`,
          requiresPayment: false
        };
      } else {
        subscriptionInfo = {
          tier: 'paid',
          message: 'Annual subscription required for new users',
          requiresPayment: true,
          amount: '9.99',
          currency: 'USD'
        };
      }
      
      res.json({
        userCount,
        nextRegistrationNumber,
        ...subscriptionInfo
      });
    } catch (error) {
      console.error('Get registration info error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get founding member statistics for popup
  app.get('/api/founding-members/stats', async (req: Request, res: Response) => {
    try {
      const foundingMemberCount = await storage.getFoundingMemberCount();
      const totalSignups = await storage.getUserCount();
      const spotsRemaining = Math.max(0, 100 - foundingMemberCount);
      const contestProgress = Math.min(100, (totalSignups / 250) * 100);

      res.json({
        foundingMemberCount,
        totalSignups,
        spotsRemaining,
        contestProgress
      });
    } catch (error) {
      console.error('Error getting founding member stats:', error);
      res.status(500).json({ message: 'Failed to get founding member stats' });
    }
  });

  // =====================
  // CONTENT MANAGEMENT API
  // Secure endpoints for external automation (Zapier/Make)
  // =====================

  // API key middleware for content automation
  const requireApiKey = (req: Request, res: Response, next: any) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.CONTENT_API_KEY || 'your-secure-api-key-change-in-production';
    
    if (!apiKey || apiKey !== validApiKey) {
      return res.status(401).json({ message: 'Invalid or missing API key' });
    }
    next();
  };

  // ====================
  // ARTICLES ENDPOINTS
  // ====================
  
  // Get all articles (public)
  app.get('/api/articles', async (req: Request, res: Response) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error('Get articles error:', error);
      res.status(500).json({ message: 'Failed to fetch articles' });
    }
  });

  // Create new article (automation)
  app.post('/api/articles', requireApiKey, async (req: Request, res: Response) => {
    try {
      const articleData = req.body;
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error('Create article error:', error);
      res.status(500).json({ message: 'Failed to create article' });
    }
  });

  // Update article (automation)
  app.put('/api/articles/:id', requireApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const article = await storage.updateArticle(id, updates);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      console.error('Update article error:', error);
      res.status(500).json({ message: 'Failed to update article' });
    }
  });

  // Delete article (automation)
  app.delete('/api/articles/:id', requireApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete article error:', error);
      res.status(500).json({ message: 'Failed to delete article' });
    }
  });

  // ====================
  // WEB STORIES ENDPOINTS
  // ====================
  
  // Get all web stories (public)
  app.get('/api/web-stories', async (req: Request, res: Response) => {
    try {
      const stories = await storage.getAllWebStories();
      res.json(stories);
    } catch (error) {
      console.error('Get web stories error:', error);
      res.status(500).json({ message: 'Failed to fetch web stories' });
    }
  });

  // Create new web story (automation)
  app.post('/api/web-stories', requireApiKey, async (req: Request, res: Response) => {
    try {
      const storyData = req.body;
      const story = await storage.createWebStory(storyData);
      res.status(201).json(story);
    } catch (error) {
      console.error('Create web story error:', error);
      res.status(500).json({ message: 'Failed to create web story' });
    }
  });

  // Update web story (automation)
  app.put('/api/web-stories/:id', requireApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const story = await storage.updateWebStory(id, updates);
      
      if (!story) {
        return res.status(404).json({ message: 'Web story not found' });
      }
      
      res.json(story);
    } catch (error) {
      console.error('Update web story error:', error);
      res.status(500).json({ message: 'Failed to update web story' });
    }
  });

  // Delete web story (automation)
  app.delete('/api/web-stories/:id', requireApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteWebStory(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete web story error:', error);
      res.status(500).json({ message: 'Failed to delete web story' });
    }
  });

  // ====================
  // DIY RECIPES ENDPOINTS
  // ====================
  
  // Get all DIY recipes (public)
  app.get('/api/diy-recipes', async (req: Request, res: Response) => {
    try {
      const recipes = await storage.getAllDiyRecipes();
      res.json(recipes);
    } catch (error) {
      console.error('Get DIY recipes error:', error);
      res.status(500).json({ message: 'Failed to fetch DIY recipes' });
    }
  });

  // Create new DIY recipe (automation)
  app.post('/api/diy-recipes', requireApiKey, async (req: Request, res: Response) => {
    try {
      const recipeData = req.body;
      const recipe = await storage.createDiyRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      console.error('Create DIY recipe error:', error);
      res.status(500).json({ message: 'Failed to create DIY recipe' });
    }
  });

  // ====================
  // FORUM ENDPOINTS
  // ====================
  
  // Get all forum posts (public)
  app.get('/api/forum/posts', async (req: Request, res: Response) => {
    try {
      const posts = await storage.getAllForumPosts();
      res.json(posts);
    } catch (error) {
      console.error('Get forum posts error:', error);
      res.status(500).json({ message: 'Failed to fetch forum posts' });
    }
  });

  // Create new forum post (authenticated users)
  app.post('/api/forum/posts', authenticateToken, async (req: Request, res: Response) => {
    try {
      const postData = { ...req.body, userId: req.user.userId };
      const post = await storage.createForumPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error('Create forum post error:', error);
      res.status(500).json({ message: 'Failed to create forum post' });
    }
  });

  // ====================
  // PRODUCT RECOMMENDATIONS ENDPOINTS
  // ====================
  
  // Get all product recommendations (public)
  app.get('/api/product-recommendations', async (req: Request, res: Response) => {
    try {
      const recommendations = await storage.getAllProductRecommendations();
      res.json(recommendations);
    } catch (error) {
      console.error('Get product recommendations error:', error);
      res.status(500).json({ message: 'Failed to fetch product recommendations' });
    }
  });

  // Create new product recommendation (automation)
  app.post('/api/product-recommendations', requireApiKey, async (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const product = await storage.createProductRecommendation(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Create product recommendation error:', error);
      res.status(500).json({ message: 'Failed to create product recommendation' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        email: string;
      };
    }
  }
}
