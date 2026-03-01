// ============================================
// ZUSTAND STORE - COMPLETE STATE MANAGEMENT
// ============================================

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User, Product, CartItem, Notification } from '@/types/models';

// ============================================
// AUTH STORE
// ============================================

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,

        setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
        
        setToken: (token) => set({ token }),
        
        login: (user, token) => set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        }),
        
        logout: () => {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false });
        },
        
        updateUser: (updates) => set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ token: state.token }),
      }
    ),
    { name: 'auth-store' }
  )
);

// ============================================
// CART STORE
// ============================================

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  couponCode: string | null;
  discount: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  
  // Computed
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isLoading: false,
        couponCode: null,
        discount: 0,

        addItem: (product, quantity = 1) => set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          const newItem: CartItem = {
            id: `cart_${product.id}_${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            price: product.price,
            addedAt: new Date().toISOString(),
          };
          
          return { items: [...state.items, newItem] };
        }),

        removeItem: (productId) => set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        })),

        updateQuantity: (productId, quantity) => set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter(item => item.productId !== productId) };
          }
          
          return {
            items: state.items.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        }),

        clearCart: () => set({ items: [], couponCode: null, discount: 0 }),
        
        applyCoupon: (code, discount) => set({ couponCode: code, discount }),
        
        removeCoupon: () => set({ couponCode: null, discount: 0 }),

        getSubtotal: () => {
          return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },

        getTax: () => {
          return get().getSubtotal() * 0.1; // 10% tax
        },

        getShipping: () => {
          const subtotal = get().getSubtotal();
          return subtotal > 100 ? 0 : 10; // Free shipping over $100
        },

        getTotal: () => {
          const subtotal = get().getSubtotal();
          const tax = get().getTax();
          const shipping = get().getShipping();
          const discount = get().discount;
          return subtotal + tax + shipping - discount;
        },

        getItemCount: () => {
          return get().items.reduce((count, item) => count + item.quantity, 0);
        },
      }),
      {
        name: 'cart-storage',
      }
    ),
    { name: 'cart-store' }
  )
);

// ============================================
// UI STORE
// ============================================

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  cartDrawerOpen: boolean;
  notifications: Notification[];
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: true,
        mobileMenuOpen: false,
        searchOpen: false,
        cartDrawerOpen: false,
        notifications: [],

        setTheme: (theme) => set({ theme }),
        
        toggleTheme: () => set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        
        setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
        
        setSearchOpen: (open) => set({ searchOpen: open }),
        
        setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
        
        addNotification: (notification) => set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif_${Date.now()}`,
              createdAt: new Date().toISOString(),
              isRead: false,
            } as Notification,
            ...state.notifications,
          ],
        })),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),
        
        markAsRead: (id) => set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
        
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      }
    ),
    { name: 'ui-store' }
  )
);

// ============================================
// PRODUCT FILTERS STORE
// ============================================

interface FiltersState {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  rating: number | null;
  inStock: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  setSearch: (search: string) => void;
  setCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  setBrands: (brands: string[]) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setRating: (rating: number | null) => void;
  setInStock: (inStock: boolean) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

const initialFiltersState = {
  search: '',
  categories: [],
  brands: [],
  priceRange: { min: 0, max: 10000 },
  rating: null,
  inStock: false,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
};

export const useFiltersStore = create<FiltersState>()(
  devtools(
    (set) => ({
      ...initialFiltersState,

      setSearch: (search) => set({ search }),
      
      setCategories: (categories) => set({ categories }),
      
      toggleCategory: (category) => set((state) => ({
        categories: state.categories.includes(category)
          ? state.categories.filter(c => c !== category)
          : [...state.categories, category],
      })),
      
      setBrands: (brands) => set({ brands }),
      
      toggleBrand: (brand) => set((state) => ({
        brands: state.brands.includes(brand)
          ? state.brands.filter(b => b !== brand)
          : [...state.brands, brand],
      })),
      
      setPriceRange: (min, max) => set({ priceRange: { min, max } }),
      
      setRating: (rating) => set({ rating }),
      
      setInStock: (inStock) => set({ inStock }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      setSortOrder: (sortOrder) => set({ sortOrder }),
      
      resetFilters: () => set(initialFiltersState),
    }),
    { name: 'filters-store' }
  )
);
