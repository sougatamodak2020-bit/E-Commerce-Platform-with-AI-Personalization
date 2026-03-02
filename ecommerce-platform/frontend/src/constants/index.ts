// ============================================
// APPLICATION CONSTANTS
// ============================================

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/[id]',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  SELLER: '/seller',
  SELLER_PRODUCTS: '/seller/products',
};

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  UPLOAD: '/api/upload',
  CATEGORIES: '/api/categories',
  REVIEWS: '/api/reviews',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  WISHLIST: '/api/wishlist',
  AI_RECOMMENDATIONS: '/api/ai/recommendations',
};

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  BANK_TRANSFER: 'bank_transfer',
};

export const SHIPPING_METHODS = {
  STANDARD: { name: 'Standard Shipping', price: 10, days: '5-7' },
  EXPRESS: { name: 'Express Shipping', price: 25, days: '2-3' },
  OVERNIGHT: { name: 'Overnight', price: 50, days: '1' },
};
