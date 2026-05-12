-- ============================================================================
-- Migration: 005 Seed Data
-- Date:      2024-01-01
-- Purpose:   Seed categories matching lib/customer/products.ts slugs
-- Order:     Run after triggers.sql
-- ============================================================================

INSERT INTO categories (name, slug, sort_order, is_active) VALUES
  ('T-Shirts', 't-shirts', 1, true),
  ('Hoodies',  'hoodies',  2, true),
  ('Shirts',   'shirts',   3, true),
  ('Pants',    'pants',    4, true),
  ('Jackets',  'jackets',  5, true),
  ('Sets',     'sets',     6, true)
ON CONFLICT (slug) DO NOTHING;
