-- ============================================================================
-- Migration: 003 RLS Policies
-- Date:      2024-01-01
-- Purpose:   Row Level Security for all Albaeon tables
-- Order:     Run after indexes.sql
-- ============================================================================

-- ── Helper: is_admin() ───────────────────────────────────────────────────────
-- Returns true if the current authenticated user has role = 'admin'
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ── 1. profiles ──────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (is_admin());

-- Insert is handled by the trigger on auth.users (service_role)

-- ── 2. addresses ─────────────────────────────────────────────────────────────
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- ── 3. categories ────────────────────────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ── 4. coupons ───────────────────────────────────────────────────────────────
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can insert coupons"
  ON coupons FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update coupons"
  ON coupons FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete coupons"
  ON coupons FOR DELETE
  USING (is_admin());

-- ── 5. products ──────────────────────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (is_admin());

-- ── 6. product_variants ──────────────────────────────────────────────────────
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view variants of visible products"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND (products.status = 'active' OR is_admin())
    )
  );

CREATE POLICY "Admins can insert variants"
  ON product_variants FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update variants"
  ON product_variants FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete variants"
  ON product_variants FOR DELETE
  USING (is_admin());

-- ── 7. product_images ────────────────────────────────────────────────────────
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view images of visible products"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND (products.status = 'active' OR is_admin())
    )
  );

CREATE POLICY "Admins can insert images"
  ON product_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update images"
  ON product_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete images"
  ON product_images FOR DELETE
  USING (is_admin());

-- ── 8. orders ────────────────────────────────────────────────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- Insert is done via service_role (admin client bypasses RLS)

-- ── 9. order_items ───────────────────────────────────────────────────────────
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update order items"
  ON order_items FOR UPDATE
  USING (is_admin());

-- ── 10. order_tracking ───────────────────────────────────────────────────────
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order tracking"
  ON order_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_tracking.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can insert tracking"
  ON order_tracking FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update tracking"
  ON order_tracking FOR UPDATE
  USING (is_admin());

-- ── 11. wishlists ────────────────────────────────────────────────────────────
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- ── 12. support_tickets ──────────────────────────────────────────────────────
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING (is_admin());

CREATE POLICY "Anyone can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE
  USING (is_admin());

-- ── 13. support_replies ──────────────────────────────────────────────────────
ALTER TABLE support_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view replies on own tickets"
  ON support_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = support_replies.ticket_id
      AND (support_tickets.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can reply to tickets"
  ON support_replies FOR INSERT
  WITH CHECK (is_admin());

-- ── 14. webhook_logs ─────────────────────────────────────────────────────────
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook logs"
  ON webhook_logs FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update webhook logs"
  ON webhook_logs FOR UPDATE
  USING (is_admin());
