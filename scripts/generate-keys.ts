#!/usr/bin/env tsx

import { randomBytes } from 'crypto';

/**
 * Generate secure random keys for environment variables
 * Run this script to generate secure keys for JWT_SECRET, ENCRYPTION_KEY, and CONTENT_API_KEY
 */

console.log('🔐 Generating secure keys for environment variables...\n');

// Generate JWT Secret (64 characters / 256 bits)
const jwtSecret = randomBytes(32).toString('hex');
console.log('JWT_SECRET (copy this to your .env file):');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Generate Encryption Key (32 characters / 128 bits for AES-256)
const encryptionKey = randomBytes(16).toString('hex');
console.log('ENCRYPTION_KEY (copy this to your .env file):');
console.log(`ENCRYPTION_KEY=${encryptionKey}\n`);

// Generate Content API Key (48 characters / 192 bits)
const contentApiKey = randomBytes(24).toString('hex');
console.log('CONTENT_API_KEY (copy this to your .env file):');
console.log(`CONTENT_API_KEY=${contentApiKey}\n`);

console.log('✅ Keys generated successfully!');
console.log('📝 Copy these keys to your .env file and keep them secure.');
console.log('⚠️  NEVER commit these keys to version control.');
console.log('🔄 Generate new keys for each environment (development, staging, production).');