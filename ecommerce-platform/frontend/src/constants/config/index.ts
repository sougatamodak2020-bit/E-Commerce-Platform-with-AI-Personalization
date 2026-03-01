// ============================================
// APP CONFIGURATION
// ============================================

export const APP_CONFIG = {
  name: 'MAISON ÉLITE',
  description: 'Luxury E-Commerce Platform with AI Personalization',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  },
  currency: {
    default: 'USD',
    symbol: '$',
    locale: 'en-US',
  },
  features: {
    ai: true,
    multiVendor: true,
    realTimeUpdates: true,
    analytics: true,
  },
} as const;

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY,
};

export const AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
  },
  recommendations: {
    maxResults: 10,
    minScore: 0.6,
  },
};

export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  maxImages: 10,
};

export const VALIDATION_CONFIG = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  product: {
    nameMinLength: 3,
    nameMaxLength: 200,
    descriptionMinLength: 10,
    descriptionMaxLength: 5000,
  },
};
