-- ==============================================================================
-- Supabase Schema for Saree & Lehenga Storefront Demo
-- Includes: products, collections, banners, RLS policies, and initial seed data
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;

-- 3. Collections Table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Products Table (Includes sizes array and gallery)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  image_url TEXT NOT NULL,
  gallery_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{"Free Size"}',
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Banners Table (Includes title, subtitle, cta_text for dynamic slides)
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  position TEXT NOT NULL, -- 'hero', 'promo-1', 'promo-2', 'full-promo', 'price-1', 'price-2', 'price-3', 'price-4'
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Anonymous (public) users get READ-ONLY access
CREATE POLICY "Public Read Collections" ON collections
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Products" ON products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Banners" ON banners
  FOR SELECT TO anon, authenticated USING (true);

-- Admin / Authenticated / Service Role can insert, update, and delete
CREATE POLICY "Admin Write Collections" ON collections
  FOR ALL TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin Write Products" ON products
  FOR ALL TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin Write Banners" ON banners
  FOR ALL TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- Storage Bucket Setup (Run in Supabase SQL editor or storage config)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can read storage objects
CREATE POLICY "Public Read Storage" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'product-media');

-- Service role and authenticated can upload
CREATE POLICY "Admin Upload Storage" ON storage.objects
  FOR INSERT TO authenticated, service_role
  WITH CHECK (bucket_id = 'product-media');

-- ==============================================================================
-- SEED DATA (Curated Royalty-Free High-Res Stock Photography)
-- ==============================================================================

-- Seed Collections
INSERT INTO collections (name, slug, image_url, description) VALUES
('Lehengas', 'lehengas', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', 'Bridal & Party Wear Embroidered Lehengas'),
('Fancy Sarees', 'fancy-sarees', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', 'Contemporary lightweight & shimmer party sarees'),
('Designer Sarees', 'designer-sarees', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop', 'Handcrafted designer drape collections'),
('Pattu Sarees', 'pattu-sarees', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop', 'Traditional pure silk Kanchipuram & Banarasi weaves'),
('Work Sarees', 'work-sarees', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop', 'Intricate zardozi, sequin, and thread embroidery sarees');

-- Seed 8 Realistic Products
INSERT INTO products (name, slug, description, price, sale_price, image_url, gallery_urls, category, sizes, in_stock, is_new, is_bestseller) VALUES
(
  'Royal Banarasi Katan Silk Saree',
  'royal-banarasi-katan-silk-saree',
  'Woven with pure gold zari floral motifs across a rich crimson body. Features an opulent pallu with intricate meenakari detailing, ideal for weddings and royal celebrations.',
  5500,
  1699,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop'
  ],
  'pattu-sarees',
  ARRAY['Free Size'],
  true,
  false,
  true
),
(
  'Maroon Velvet Embroidered Bridal Lehenga',
  'maroon-velvet-embroidered-bridal-lehenga',
  'Opulent micro-velvet lehenga layered with heritage dori, resham, and glittering sequins. Comes with matching blouse piece and double shaded net dupatta.',
  12999,
  4999,
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop'
  ],
  'lehengas',
  ARRAY['S', 'M', 'L', 'XL', 'Semi-Stitched'],
  true,
  true,
  true
),
(
  'Semi Kanchi Vintage Gold Border Saree',
  'semi-kanchi-vintage-gold-border-saree',
  'Lightweight semi-silk saree adorned with temple borders and geometric woven patterns. Effortless to drape for day festivals and family functions.',
  1899,
  555,
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
  ],
  'fancy-sarees',
  ARRAY['Free Size'],
  true,
  false,
  true
),
(
  'Designer Organza Floral Pastel Saree',
  'designer-organza-floral-pastel-saree',
  'Ethereal organza silk featuring handcrafted digital floral art with hand-embellished scallop cutwork border. Soft, breathable, and ultra chic.',
  3200,
  1250,
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop'
  ],
  'designer-sarees',
  ARRAY['Free Size'],
  true,
  true,
  false
),
(
  'Soft Silk Gadwal Festive Saree',
  'soft-silk-gadwal-festive-saree',
  'Traditional Gadwal weave crafted with contrasting kuttu border and pure zari butta work. Soft drape finish designed for all-day comfort.',
  1699,
  599,
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop'
  ],
  'fancy-sarees',
  ARRAY['Free Size'],
  true,
  true,
  false
),
(
  'Heavy Hand-Work Zardozi Saree',
  'heavy-hand-work-zardozi-saree',
  'Pure georgette saree heavily accented with antique gold zardozi, cutdana, and pearl border craftsmanship. Perfect statement heirloom piece.',
  4500,
  1899,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
  ],
  'work-sarees',
  ARRAY['Free Size'],
  true,
  false,
  false
),
(
  'Dusty Rose Georgette Mirror-Work Lehenga',
  'dusty-rose-georgette-mirror-work-lehenga',
  'Contemporary pastel lehenga set accented with real foil mirror work and thread embroidery. Includes flared skirt, stitched designer blouse, and ruffled dupatta.',
  8999,
  3499,
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'
  ],
  'lehengas',
  ARRAY['S', 'M', 'L', 'XL'],
  true,
  false,
  true
);

-- Seed Banners
INSERT INTO banners (image_url, link_url, title, subtitle, cta_text, position, sort_order) VALUES
(
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
  '/collections/pattu-sarees',
  'Heritage Weaves of India',
  'Handcrafted Sarees & Lehengas from ₹300',
  'Explore Sarees',
  'hero',
  1
),
(
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
  '/collections/lehengas',
  'The Royal Bridal Edition',
  'Exquisite Velvet & Georgette Masterpieces',
  'Shop Lehengas',
  'hero',
  2
),
(
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
  '/collections/fancy-sarees',
  'Festive Offer Zone',
  'Up to 70% Off on Trending Sarees',
  'View Offers',
  'promo-1',
  1
),
(
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
  '/collections/lehengas',
  'Royal Heritage Bridal Edit',
  'Designer Lehengas & Sets from ₹3,999',
  'Shop Bridal',
  'promo-2',
  2
),
(
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600&auto=format&fit=crop',
  '/collections/designer-sarees',
  'Pure Elegance in Every Drape',
  'Honest Prices Since 1996 • Direct from Artisans',
  'Discover Collection',
  'full-promo',
  1
);
