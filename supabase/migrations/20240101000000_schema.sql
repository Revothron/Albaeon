-- ============================================================================
-- Migration: 001 Schema
-- Date:      2024-01-01
-- Purpose:   Create all tables and enum types for Albaeon
-- Order:     Execute standalone in Supabase SQL editor
-- ============================================================================

-- ── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE address_type AS ENUM ('shipping', 'billing');
CREATE TYPE product_status AS ENUM ('active', 'draft');
CREATE TYPE design_type AS ENUM ('original', 'licensed');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'stripe', 'cod');
CREATE TYPE pod_provider AS ENUM ('banian', 'gelato');
CREATE TYPE stock_status AS ENUM ('in_stock', 'out_of_stock', 'pre_order', 'discontinued');
CREATE TYPE coupon_type AS ENUM ('percentage', 'flat');
CREATE TYPE ticket_status AS ENUM ('unread', 'pending', 'resolved');
CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high');

-- ── 1. profiles ──────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  first_name   TEXT,
  last_name    TEXT,
  display_name TEXT,
  phone        TEXT,
  role         user_role NOT NULL DEFAULT 'customer',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. addresses ─────────────────────────────────────────────────────────────
CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        address_type NOT NULL DEFAULT 'shipping',
  full_name   TEXT NOT NULL,
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country     TEXT NOT NULL,
  phone       TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. categories ────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  image_url  TEXT,
  parent_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. coupons ───────────────────────────────────────────────────────────────
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL UNIQUE,
  type            coupon_type NOT NULL,
  value           NUMERIC NOT NULL,
  min_order_amount NUMERIC,
  usage_limit     INTEGER,
  per_user_limit  INTEGER NOT NULL DEFAULT 1,
  used_count      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5. products ──────────────────────────────────────────────────────────────
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  sku               TEXT NOT NULL UNIQUE,
  description       TEXT,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  price_inr         NUMERIC NOT NULL,
  price_usd         NUMERIC,
  status            product_status NOT NULL DEFAULT 'draft',
  is_new_arrival    BOOLEAN NOT NULL DEFAULT false,
  is_best_seller    BOOLEAN NOT NULL DEFAULT false,
  design_type       design_type NOT NULL DEFAULT 'original',
  highlights        JSONB NOT NULL DEFAULT '[]'::jsonb,
  gelato_template_id TEXT,
  wash_care         TEXT,
  size_chart        TEXT,
  tags              TEXT[],
  meta_title        TEXT,
  meta_description  TEXT,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 6. product_variants ──────────────────────────────────────────────────────
CREATE TABLE product_variants (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id                UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color                     TEXT NOT NULL,
  color_hex                 TEXT,
  size                      TEXT NOT NULL,
  sku                       TEXT NOT NULL,
  stock_status              stock_status NOT NULL DEFAULT 'in_stock',
  sort_order                INTEGER NOT NULL DEFAULT 0,
  gelato_product_uid        TEXT,
  gelato_print_file_front   TEXT,
  gelato_print_file_back    TEXT,
  gelato_template_variant_id TEXT,
  banian_sku                TEXT,
  gelato_price_usd          NUMERIC,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, sku)
);

-- ── 7. product_images ────────────────────────────────────────────────────────
CREATE TABLE product_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cloudinary_id TEXT NOT NULL,
  url           TEXT NOT NULL,
  alt_text      TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 8. orders ────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number             TEXT NOT NULL UNIQUE,
  user_id                  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status                   order_status NOT NULL DEFAULT 'pending',
  payment_status           payment_status NOT NULL DEFAULT 'pending',
  payment_gateway          payment_gateway NOT NULL,
  payment_id               TEXT,
  provider                 pod_provider NOT NULL,
  subtotal                 NUMERIC NOT NULL,
  discount_amount          NUMERIC NOT NULL DEFAULT 0,
  shipping_amount          NUMERIC NOT NULL DEFAULT 0,
  total_amount             NUMERIC NOT NULL,
  currency                 TEXT NOT NULL DEFAULT 'INR',
  coupon_id                UUID REFERENCES coupons(id) ON DELETE SET NULL,
  shipping_address_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes                    TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 9. order_items ───────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL,
  variant_id   UUID NOT NULL,
  product_name TEXT NOT NULL,
  variant_sku  TEXT NOT NULL,
  color        TEXT NOT NULL,
  size         TEXT NOT NULL,
  quantity     INTEGER NOT NULL,
  unit_price   NUMERIC NOT NULL,
  subtotal     NUMERIC NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 10. order_tracking ───────────────────────────────────────────────────────
CREATE TABLE order_tracking (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number    TEXT,
  courier            TEXT,
  courier_url        TEXT,
  estimated_delivery TIMESTAMPTZ,
  gelato_order_id    TEXT,
  banian_form_response JSONB,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 11. wishlists ────────────────────────────────────────────────────────────
CREATE TABLE wishlists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- ── 12. support_tickets ──────────────────────────────────────────────────────
CREATE TABLE support_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  subject         TEXT NOT NULL,
  message         TEXT NOT NULL,
  status          ticket_status NOT NULL DEFAULT 'unread',
  priority        ticket_priority NOT NULL DEFAULT 'normal',
  linked_order_id TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 13. support_replies ──────────────────────────────────────────────────────
CREATE TABLE support_replies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  admin_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  sent_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 14. webhook_logs ─────────────────────────────────────────────────────────
CREATE TABLE webhook_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source     TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload    JSONB NOT NULL,
  processed  BOOLEAN NOT NULL DEFAULT false,
  status     TEXT,
  error      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
