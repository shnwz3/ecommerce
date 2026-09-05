-- ==============================================================================
-- Supabase Schema for Customer Orders (Run in Supabase SQL Editor)
-- Creates the production orders table with RLS policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Orders" ON orders;
DROP POLICY IF EXISTS "Public Insert Orders" ON orders;
DROP POLICY IF EXISTS "Admin Read Orders" ON orders;
DROP POLICY IF EXISTS "Admin Update Orders" ON orders;
DROP POLICY IF EXISTS "Admin All Orders" ON orders;

-- Allow customer order placement
CREATE POLICY "Public Insert Orders" ON orders
  FOR INSERT TO anon, authenticated, service_role
  WITH CHECK (true);

-- Allow reading orders (Admin dashboard and customer confirmation)
CREATE POLICY "Public Read Orders" ON orders
  FOR SELECT TO anon, authenticated, service_role
  USING (true);

-- Allow order updates (Status updates: ordered, shipped, delivered, payment)
CREATE POLICY "Admin Update Orders" ON orders
  FOR UPDATE TO authenticated, service_role
  USING (true)
  WITH CHECK (true);
