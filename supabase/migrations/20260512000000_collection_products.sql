-- Junction table: many-to-many between collections and products
CREATE TABLE IF NOT EXISTS collection_products (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (collection_id, product_id)
);

-- Indexes for both directions
CREATE INDEX IF NOT EXISTS idx_collection_products_collection
  ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product
  ON collection_products(product_id);

-- RLS
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collection_products"
  ON collection_products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert collection_products"
  ON collection_products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can delete collection_products"
  ON collection_products FOR DELETE
  USING (auth.jwt() ->> 'role' = 'service_role');
