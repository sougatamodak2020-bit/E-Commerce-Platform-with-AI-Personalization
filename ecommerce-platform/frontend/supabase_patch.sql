
-- Add missing columns to orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_code TEXT,
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gift_message TEXT,
  ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS refund_reason TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add missing columns to order_items too (common source of similar errors)
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS variant_id UUID,
  ADD COLUMN IF NOT EXISTS variant_title TEXT,
  ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS is_gift_card BOOLEAN DEFAULT FALSE;

-- Add missing columns to products (common)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS vendor TEXT,
  ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'piece';

-- Add missing columns to profiles (common)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
