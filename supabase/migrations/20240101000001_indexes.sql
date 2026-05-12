-- ============================================================================
-- Migration: 002 Indexes
-- Date:      2024-01-01
-- Purpose:   Performance indexes for Albaeon queries
-- Order:     Run after schema.sql
-- ============================================================================

-- ── profiles ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ── addresses ────────────────────────────────────────────────────────────────
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_user_default ON addresses(user_id, is_default);

-- ── categories ───────────────────────────────────────────────────────────────
CREATE INDEX idx_categories_active_sort ON categories(is_active, sort_order);

-- ── products ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_status_category ON products(status, category_id);
CREATE INDEX idx_products_status_created ON products(status, created_at DESC);
CREATE INDEX idx_products_status_price ON products(status, price_inr);
CREATE INDEX idx_products_status_name ON products(status, name);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- ── product_variants ─────────────────────────────────────────────────────────
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_product_stock ON product_variants(product_id, stock_status);

-- ── product_images ───────────────────────────────────────────────────────────
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary);
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);

-- ── orders ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_id ON orders(payment_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_provider ON orders(provider);
CREATE INDEX idx_orders_paid_created ON orders(payment_status, created_at);

-- ── order_items ──────────────────────────────────────────────────────────────
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

-- ── order_tracking ───────────────────────────────────────────────────────────
CREATE INDEX idx_order_tracking_gelato ON order_tracking(gelato_order_id);

-- ── wishlists ────────────────────────────────────────────────────────────────
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- ── support_tickets ──────────────────────────────────────────────────────────
CREATE INDEX idx_support_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);

-- ── support_replies ──────────────────────────────────────────────────────────
CREATE INDEX idx_support_replies_ticket ON support_replies(ticket_id);
CREATE INDEX idx_support_replies_sent ON support_replies(sent_at);

-- ── webhook_logs ─────────────────────────────────────────────────────────────
CREATE INDEX idx_webhook_logs_source_event ON webhook_logs(source, event_type);
CREATE INDEX idx_webhook_logs_created ON webhook_logs(created_at DESC);
