/**
 * Environment Configuration and Validation
 * 
 * This module validates all required environment variables and provides
 * typed access to configuration values.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface EnvironmentConfig {
  // Database
  DATABASE_URL: string;
  
  // Authentication
  CLERK_SECRET_KEY: string;
  VITE_CLERK_PUBLISHABLE_KEY: string;
  
  // AI Services
  OPENAI_API_KEY: string;
  
  // Payment
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  
  // Email
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  
  // API Keys
  CONTENT_API_KEY: string;
  
  // Security
  JWT_SECRET: string;
  ENCRYPTION_KEY: string;
  
  // Optional Analytics
  VITE_GA_TRACKING_ID?: string;
  
  // Optional Monitoring
  SENTRY_DSN?: string;
  
  // Optional File Storage
  CLOUDINARY_URL?: string;
  
  // System
  NODE_ENV: string;
  PORT: string;
}

/**
 * Required environment variables - these must be set for the application to function
 */
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'CLERK_SECRET_KEY', 
  'VITE_CLERK_PUBLISHABLE_KEY',
  'OPENAI_API_KEY',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'SENDGRID_API_KEY',
  'SENDGRID_FROM_EMAIL',
  'CONTENT_API_KEY',
  'JWT_SECRET',
  'ENCRYPTION_KEY'
] as const;

/**
 * Optional environment variables - these have defaults or are not critical for basic functionality
 */
const OPTIONAL_ENV_VARS = [
  'VITE_GA_TRACKING_ID',
  'SENTRY_DSN',
  'CLOUDINARY_URL',
  'NODE_ENV',
  'PORT'
] as const;

/**
 * Validates that all required environment variables are set
 * @param strict - If true, throws an error for missing variables. If false, logs warnings.
 * @returns Configuration object with validated environment variables
 */
export function validateEnvironmentConfig(strict: boolean = false): EnvironmentConfig {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (!value || value.trim() === '' || 
        value === `your_${varName.toLowerCase()}` ||
        value === `your_${varName.toLowerCase().replace(/_/g, '_')}` ||
        (varName === 'DATABASE_URL' && value === 'postgresql://user:password@localhost:5432/skinlabs_dev') ||
        (varName === 'CONTENT_API_KEY' && value === 'dev_secure_api_key_change_in_production')) {
      missing.push(varName);
    }
  }
  
  // Check optional variables and note if they're using placeholder values
  for (const varName of OPTIONAL_ENV_VARS) {
    const value = process.env[varName];
    if (value && (value === `your_${varName.toLowerCase()}` || value.includes('your_'))) {
      warnings.push(`${varName} is using a placeholder value`);
    }
  }
  
  // Handle missing required variables
  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}\n` +
                   `Please copy .env.example to .env and configure the required values.`;
    
    if (strict) {
      throw new Error(message);
    } else {
      console.warn(`⚠️  ${message}`);
    }
  }
  
  // Log warnings for placeholder values
  if (warnings.length > 0) {
    console.warn(`⚠️  Warning: ${warnings.join(', ')}`);
  }
  
  // Return configuration object
  return {
    // Database
    DATABASE_URL: process.env.DATABASE_URL || '',
    
    // Authentication
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '',
    VITE_CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY || '',
    
    // AI Services
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    
    // Payment
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
    
    // Email
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'noreply@skinlabs.co.za',
    
    // API Keys
    CONTENT_API_KEY: process.env.CONTENT_API_KEY || 'your-secure-api-key-change-in-production',
    
    // Security
    JWT_SECRET: process.env.JWT_SECRET || '',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
    
    // Optional
    VITE_GA_TRACKING_ID: process.env.VITE_GA_TRACKING_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    
    // System
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '5000'
  };
}

/**
 * Get validated environment configuration
 * In production, this will throw an error for missing required variables
 * In development, this will log warnings but continue
 */
export const config = validateEnvironmentConfig(process.env.NODE_ENV === 'production');

/**
 * Helper function to check if we're in development mode
 */
export const isDevelopment = config.NODE_ENV === 'development';

/**
 * Helper function to check if we're in production mode  
 */
export const isProduction = config.NODE_ENV === 'production';