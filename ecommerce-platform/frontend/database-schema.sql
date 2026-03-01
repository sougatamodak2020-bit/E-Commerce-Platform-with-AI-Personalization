-- =============================================
-- MAISON ÉLITE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  sku TEXT UNIQUE,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  seller_id UUID REFERENCES public.users(id),
  tags TEXT[] DEFAULT '{}',
  attributes JSONB DEFAULT '{}',
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Cart table (for persistent carts)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read all products
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (is_active = true);

-- Sellers can manage their own products
CREATE POLICY "Sellers can manage own products" ON public.products
  FOR ALL USING (auth.uid() = seller_id);

-- Admins can manage all products
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order number
DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET 
    rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM public.reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for product rating
DROP TRIGGER IF EXISTS update_rating_on_review ON public.reviews;
CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Electronics', 'electronics', 'Latest gadgets and tech accessories', 1),
  ('Fashion', 'fashion', 'Trendy clothing and accessories', 2),
  ('Home & Living', 'home-living', 'Furniture and home decor', 3),
  ('Beauty', 'beauty', 'Skincare, makeup, and fragrances', 4),
  ('Sports', 'sports', 'Sports equipment and activewear', 5),
  ('Jewelry', 'jewelry', 'Luxury jewelry and watches', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, description, price, compare_at_price, images, category, brand, sku, stock, is_featured, tags) VALUES
  ('Premium Wireless Headphones', 'High-fidelity audio with active noise cancellation', 299.00, 399.00, ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'], 'electronics', 'AudioPro', 'HP-001', 50, true, ARRAY['wireless', 'premium', 'noise-cancelling']),
  ('Luxury Watch Collection', 'Swiss-made automatic movement with sapphire crystal', 1299.00, 1599.00, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'], 'jewelry', 'TimeKeeper', 'WH-002', 25, true, ARRAY['luxury', 'watch', 'swiss']),
  ('Designer Sunglasses', 'UV400 protection with polarized lenses', 199.00, NULL, ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'], 'fashion', 'VisionStyle', 'SG-003', 100, false, ARRAY['fashion', 'summer', 'uv-protection']),
  ('Smart Home Speaker', 'Voice-controlled AI assistant with premium sound', 149.00, NULL, ARRAY['https://images.unsplash.com/photo-1543512214-318c7553f230?w=800'], 'electronics', 'SmartLiving', 'SP-004', 75, true, ARRAY['smart', 'home', 'ai']),
  ('Leather Messenger Bag', 'Handcrafted genuine Italian leather', 249.00, NULL, ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'], 'fashion', 'CraftLeather', 'BG-005', 30, false, ARRAY['leather', 'bag', 'handcrafted']),
  ('Fitness Tracker Pro', 'Advanced health monitoring with GPS', 179.00, 229.00, ARRAY['https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800'], 'electronics', 'FitTech', 'FT-006', 60, true, ARRAY['fitness', 'wearable', 'health']),
  ('Ceramic Vase Set', 'Minimalist Scandinavian design', 89.00, NULL, ARRAY['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'], 'home-living', 'HomeCraft', 'VS-007', 45, false, ARRAY['home', 'decor', 'minimalist']),
  ('Professional Camera Lens', '85mm f/1.4 portrait lens', 899.00, NULL, ARRAY['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800'], 'electronics', 'PhotoPro', 'CL-008', 15, true, ARRAY['camera', 'photography', 'professional'])
ON CONFLICT (sku) DO NOTHING;
