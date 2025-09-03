import { clerkClient } from '@clerk/clerk-sdk-node';
import { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { storage } from './storage-db';

// Initialize Clerk client
const clerk = clerkClient;

// Sync Clerk user with local database
export async function syncClerkUser(clerkUserId: string) {
  try {
    const clerkUser = await clerk.users.getUser(clerkUserId);
    
    // Check if user exists in our database
    let localUser = await storage.getUserByEmail(clerkUser.emailAddresses[0]?.emailAddress || '');
    
    if (!localUser) {
      // Create new user in our database
      const foundingMemberCount = await storage.getFoundingMemberCount();
      const isFoundingMember = foundingMemberCount < 1000;
      
      localUser = await storage.createUser({
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImageUrl: clerkUser.profileImageUrl,
        authProvider: 'clerk',
        emailVerified: true,
        subscriptionStatus: isFoundingMember ? 'free_lifetime' : 'trial',
        isFoundingMember,
        trialEndDate: isFoundingMember ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    }
    
    return localUser;
  } catch (error) {
    console.error('Error syncing Clerk user:', error);
    throw error;
  }
}

// Verify Clerk session token
export async function verifyClerkToken(token: string) {
  try {
    const sessionToken = await clerk.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    return sessionToken;
  } catch (error) {
    console.error('Error verifying Clerk token:', error);
    return null;
  }
}

// Middleware to check if user is authenticated with Clerk
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '') || 
                        req.cookies?.__session;
    
    if (!sessionToken) {
      return res.status(401).json({ message: 'No session token provided' });
    }

    const session = await clerk.verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    
    if (!session) {
      return res.status(401).json({ message: 'Invalid session token' });
    }

    // Get user from Clerk and sync with local database
    const localUser = await syncClerkUser(session.sub);
    (req as any).user = {
      id: localUser.id,
      clerkId: session.sub,
      email: localUser.email,
      subscriptionStatus: localUser.subscriptionStatus,
      isFoundingMember: localUser.isFoundingMember,
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

// Optional auth middleware (doesn't fail if no token)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '') || 
                        req.cookies?.__session;
    
    if (sessionToken) {
      const session = await clerk.verifyToken(sessionToken, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      
      if (session) {
        const localUser = await syncClerkUser(session.sub);
        (req as any).user = {
          id: localUser.id,
          clerkId: session.sub,
          email: localUser.email,
          subscriptionStatus: localUser.subscriptionStatus,
          isFoundingMember: localUser.isFoundingMember,
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

// Setup Clerk authentication
export function setupAuth(app: Express) {
  // Add cookie parser middleware if not already added
  app.use(cookieParser());
  
  console.log('Clerk authentication configured');
}