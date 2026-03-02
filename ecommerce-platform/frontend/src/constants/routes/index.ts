// ============================================
// ROUTE CONSTANTS
// ============================================

export const ROUTES = {
  HOME: '/',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Shop
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CATEGORIES: '/categories',
  CATEGORY: (slug: string) => `/categories/${slug}`,
  SEARCH: '/search',
  
  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: (id: string) => `/orders/${id}/confirmation`,
  
  // User
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  WISHLIST: '/wishlist',
  ADDRESSES: '/addresses',
  SETTINGS: '/settings',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SELLERS: '/admin/sellers',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Seller
  SELLER: '/seller',
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_ORDERS: '/seller/orders',
  SELLER_ANALYTICS: '/seller/analytics',
  SELLER_SETTINGS: '/seller/settings',
  
  // API
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
    },
    PRODUCTS: {
      LIST: '/api/products',
      DETAIL: (id: string) => `/api/products/${id}`,
      CREATE: '/api/products',
      UPDATE: (id: string) => `/api/products/${id}`,
      DELETE: (id: string) => `/api/products/${id}`,
    },
    ORDERS: {
      LIST: '/api/orders',
      DETAIL: (id: string) => `/api/orders/${id}`,
      CREATE: '/api/orders',
      UPDATE: (id: string) => `/api/orders/${id}`,
    },
    AI: {
      RECOMMENDATIONS: '/api/ai/recommendations',
      SEARCH: '/api/ai/search',
      CHAT: '/api/ai/chat',
    },
  },
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.PRODUCTS,
  ROUTES.CATEGORIES,
  ROUTES.SEARCH,
];

export const PROTECTED_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.ORDERS,
  ROUTES.WISHLIST,
  ROUTES.CHECKOUT,
];

export const ADMIN_ROUTES = Object.values(ROUTES)
  .filter(route => typeof route === 'string' && route.startsWith('/admin'));

export const SELLER_ROUTES = Object.values(ROUTES)
  .filter(route => typeof route === 'string' && route.startsWith('/seller'));
