import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import { Express } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from './storage-db';
import { pool } from './db';

const PgSession = ConnectPgSimple(session);

// JWT secret for token signing
const JWT_SECRET = process.env.JWT_SECRET || 'skynn-secret-key-change-in-production';

// Configure session store
export function configureSession() {
  return session({
    store: new PgSession({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || 'skynn-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  });
}

// Configure passport strategies
export function configurePassport() {
  // Local Strategy for email/password login
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await storage.verifyPassword(email, password);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid email or password' });
        }
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with Google ID
        let user = await storage.getUserByGoogleId(profile.id);
        
        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        if (profile.emails && profile.emails[0]) {
          user = await storage.getUserByEmail(profile.emails[0].value);
          
          if (user) {
            // Link Google account to existing user
            await storage.updateUser(user.id, {
              googleId: profile.id,
              authProvider: 'google',
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              profileImageUrl: profile.photos?.[0]?.value,
            });
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await storage.createUser({
          email: profile.emails?.[0]?.value || '',
          googleId: profile.id,
          authProvider: 'google',
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          profileImageUrl: profile.photos?.[0]?.value,
          emailVerified: true,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }));
  }

  // Serialize/deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Generate JWT token
export function generateToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
      isFoundingMember: user.isFoundingMember,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = decoded;
  next();
}

// Optional auth middleware (doesn't fail if no token)
export function optionalAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  
  next();
}

// Setup authentication middleware
export function setupAuth(app: Express) {
  app.use(configureSession());
  app.use(passport.initialize());
  app.use(passport.session());
  
  configurePassport();
}