-- ============================================
-- SEED DATA FOR DEVELOPMENT
-- ============================================

-- Insert Demo Admin User
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) VALUES
('admin@maisonelite.com', crypt('Admin@123', gen_salt('bf')), 'Admin', 'Elite', 'admin', TRUE),
('seller@maisonelite.com', crypt('Seller@123', gen_salt('bf')), 'John', 'Seller', 'seller', TRUE),
('demo@maisonelite.com', crypt('Demo@123', gen_salt('bf')), 'Demo', 'User', 'customer', TRUE);

-- Insert Categories
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Electronics', 'electronics', 'Latest electronic gadgets and devices', TRUE, 1),
('Fashion', 'fashion', 'Trending fashion and apparel', TRUE, 2),
('Home & Living', 'home-living', 'Beautiful home decor and furniture', TRUE, 3),
('Jewelry', 'jewelry', 'Luxury jewelry and accessories', TRUE, 4),
('Sports', 'sports', 'Sports equipment and fitness gear', TRUE, 5),
('Beauty', 'beauty', 'Beauty and personal care products', TRUE, 6);

-- Insert Demo Products
WITH seller AS (SELECT id FROM users WHERE email = 'seller@maisonelite.com' LIMIT 1),
     cat_electronics AS (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
     cat_fashion AS (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
     cat_jewelry AS (SELECT id FROM categories WHERE slug = 'jewelry' LIMIT 1)
INSERT INTO products (
    seller_id, category_id, name, slug, description, price, compare_at_price,
    sku, stock, brand, images, is_active, is_featured, tags
) VALUES
(
    (SELECT id FROM seller),
    (SELECT id FROM cat_electronics),
    'Premium Wireless Headphones',
    'premium-wireless-headphones',
    'Experience superior sound quality with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort.',
    299.00, 399.00,
    'HP-WL-001', 50,
    'AudioPro',
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    TRUE, TRUE,
    ARRAY['wireless', 'premium', 'audio', 'bestseller']
),
(
    (SELECT id FROM seller),
    (SELECT id FROM cat_jewelry),
    'Luxury Automatic Watch',
    'luxury-automatic-watch',
    'Swiss-made automatic movement watch with sapphire crystal, leather strap, and elegant design perfect for any occasion.',
    1299.00, 1599.00,
    'WH-LX-001', 25,
    'TimeKeeper',
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    TRUE, TRUE,
    ARRAY['luxury', 'watch', 'swiss', 'featured']
),
(
    (SELECT id FROM seller),
    (SELECT id FROM cat_fashion),
    'Designer Sunglasses',
    'designer-sunglasses',
    'UV protection designer sunglasses with polarized lenses and premium acetate frames.',
    199.00, NULL,
    'SG-DS-001', 100,
    'VisionStyle',
    ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
    TRUE, FALSE,
    ARRAY['fashion', 'sunglasses', 'designer']
),
(
    (SELECT id FROM seller),
    (SELECT id FROM cat_electronics),
    'Smart Home Speaker',
    'smart-home-speaker',
    'Voice-controlled AI assistant with premium sound quality, smart home integration, and sleek design.',
    149.00, NULL,
    'SP-SH-001', 75,
    'SmartLiving',
    ARRAY['https://images.unsplash.com/photo-1543512214-318c7553f230?w=800'],
    TRUE, TRUE,
    ARRAY['smart', 'home', 'speaker', 'ai']
);

-- Insert Demo Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, is_active, valid_until) VALUES
('WELCOME10', 'Welcome discount - 10% off first order', 'percentage', 10.00, 50.00, TRUE, NOW() + INTERVAL '30 days'),
('SAVE20', 'Save $20 on orders over $200', 'fixed', 20.00, 200.00, TRUE, NOW() + INTERVAL '60 days'),
('FREESHIP', 'Free shipping on all orders', 'fixed', 10.00, 0.00, TRUE, NOW() + INTERVAL '90 days');
