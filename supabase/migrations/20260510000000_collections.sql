-- Collections table for shop menu items (New Arrivals, Best Sellers, Limited Drops)
CREATE TABLE IF NOT EXISTS collections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  filter_rule TEXT NOT NULL DEFAULT 'all',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add is_limited_drop to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_limited_drop BOOLEAN NOT NULL DEFAULT false;

-- Index for active collections ordering
CREATE INDEX IF NOT EXISTS idx_collections_active_sort ON collections(is_active, sort_order);

-- RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collections"
  ON collections FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert collections"
  ON collections FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can update collections"
  ON collections FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can delete collections"
  ON collections FOR DELETE
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Seed default collections
INSERT INTO collections (name, slug, filter_rule, sort_order, is_active) VALUES
  ('New Arrivals', 'new-arrivals', 'new_arrivals', 1, true),
  ('Best Sellers', 'best-sellers', 'best_sellers', 2, true),
  ('Limited Drops', 'limited-drops', 'limited_drops', 3, true),
  ('All Products', 'all', 'all', 4, true)
ON CONFLICT (slug) DO NOTHING;
