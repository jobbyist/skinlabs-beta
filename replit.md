# Overview

This is SKYNN (SKINLABS), a South African skincare platform that provides expertly curated, derm-informed content about skincare. The platform combines content management with personalized user experiences, offering skincare guides, product reviews, ingredient explanations, deals, and personalized routines tailored for South African users.

The application is built as a full-stack web platform with a React frontend and Express.js backend, featuring user authentication, skin profiling, content management, subscription functionality, and Progressive Web App (PWA) capabilities for mobile iOS and Android deployment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/UI components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom SKYNN brand colors and design system
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Development**: Hot reloading with Vite middleware integration

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**:
  - `users`: User accounts with subscription status and authentication details
  - `user_skin_profiles`: Personalized skin analysis data (skin type, concerns, goals, budget)
  - `articles`: Content management for guides, reviews, and educational content
  - `deals`: Promotional offers and discounts from skincare brands
  - `saved_articles`: User bookmarking functionality

## Authentication & Authorization
- **Strategy**: JWT tokens with 7-day expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **Session Persistence**: Local storage for token management
- **Authorization**: Middleware-based route protection for authenticated endpoints

## Content Management
- **Article System**: Categorized content (guides, ingredients, routines, reviews, deals, local brands)
- **User Personalization**: Skin profiling with Fitzpatrick scale, concerns, goals, and budget tracking
- **Bookmarking**: Save/unsave functionality for user content curation
- **Featured Content**: Editorial control over highlighted articles and deals

## Subscription System
- **Tiers**: Free lifetime (founding members), Free trial, Premium subscription
- **Founding Member Benefits**: Special recognition and permanent free access
- **Trial Management**: Time-limited premium feature access

## Mobile App Development (PWA)
- **Progressive Web App**: Native-like mobile experience for iOS and Android
- **Installation**: App can be installed directly from browser on mobile devices
- **Offline Support**: Service worker provides offline functionality and caching
- **Mobile Navigation**: Bottom tab navigation optimized for touch interaction
- **Touch Gestures**: Swipe gestures for web stories and mobile interactions
- **App Icons**: Complete icon set (72x72 to 512x512) for various device sizes
- **Mobile Header**: Collapsible mobile header with menu and search functionality
- **Safe Area Support**: Handles device notches and safe areas (iPhone X+)
- **Install Prompts**: Smart install prompts that respect user preferences

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm & drizzle-zod**: Type-safe ORM and validation integration
- **@tanstack/react-query**: Server state management and caching
- **express**: Backend web framework
- **bcrypt**: Password hashing and security
- **jsonwebtoken**: JWT token generation and verification

## UI Component Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **lucide-react**: Modern icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants

## Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety across the stack
- **@replit/vite-plugin-***: Replit-specific development plugins
- **esbuild**: Fast JavaScript bundling for production

## Validation & Forms
- **zod**: Schema validation library
- **react-hook-form**: Performant form library
- **@hookform/resolvers**: Integration between react-hook-form and zod

## Utility Libraries
- **date-fns**: Modern date utility library
- **clsx & tailwind-merge**: Conditional className utilities
- **nanoid**: URL-safe unique ID generator
- **wouter**: Lightweight routing library