import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side client (for components)
export const createBrowserClient = () =>
  createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'customer' | 'seller' | 'admin';
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['users']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          compare_at_price: number | null;
          images: string[];
          category: string;
          subcategory: string | null;
          brand: string;
          sku: string;
          stock: number;
          is_active: boolean;
          is_featured: boolean;
          seller_id: string;
          tags: string[];
          attributes: Record<string, string>;
          rating: number;
          review_count: number;
          view_count: number;
          purchase_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['products']['Row'],
          | 'id'
          | 'created_at'
          | 'updated_at'
          | 'rating'
          | 'review_count'
          | 'view_count'
          | 'purchase_count'
        >;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          items: any[];
          subtotal: number;
          tax: number;
          shipping: number;
          discount: number;
          total: number;
          status:
            | 'pending'
            | 'confirmed'
            | 'processing'
            | 'shipped'
            | 'delivered'
            | 'cancelled';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method: string;
          shipping_address: Record<string, any>;
          billing_address: Record<string, any>;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['orders']['Row'],
          'id' | 'order_number' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          parent_id: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['categories']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string;
          comment: string;
          images: string[];
          helpful_count: number;
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['reviews']['Row'],
          'id' | 'created_at' | 'helpful_count'
        >;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
    };
  };
}

// Helper functions
export const dbHelpers = {
  async getProducts(options?: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
  }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }
    if (options?.featured) {
      query = query.eq('is_featured', true);
    }
    if (options?.sort === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (options?.sort === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (options?.sort === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    return query;
  },

  async getProduct(id: string) {
    return supabase.from('products').select('*').eq('id', id).single();
  },

  async createProduct(
    product: Database['public']['Tables']['products']['Insert']
  ) {
    return supabase.from('products').insert(product).select().single();
  },

  async updateProduct(
    id: string,
    updates: Database['public']['Tables']['products']['Update']
  ) {
    return supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteProduct(id: string) {
    return supabase.from('products').delete().eq('id', id);
  },

  async createOrder(
    order: Database['public']['Tables']['orders']['Insert']
  ) {
    return supabase.from('orders').insert(order).select().single();
  },

  async getOrders(userId?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    return query;
  },

  async updateOrderStatus(orderId: string, status: string) {
    return supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
  },

  async getCategories() {
    return supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
  },

  async getProductReviews(productId: string) {
    return supabase
      .from('reviews')
      .select('*, users(first_name, last_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
  },

  async createReview(
    review: Database['public']['Tables']['reviews']['Insert']
  ) {
    return supabase.from('reviews').insert(review).select().single();
  },

  async uploadImage(file: File, bucket: string = 'products') {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },
};