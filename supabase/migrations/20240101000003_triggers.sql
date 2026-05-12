-- ============================================================================
-- Migration: 004 Triggers
-- Date:      2024-01-01
-- Purpose:   Automatic profile creation, updated_at timestamps, order_number
-- Order:     Run after rls.sql
-- ============================================================================

-- ── Helper: updated_at trigger function ───────────────────────────────────────
CREATE OR REPLACE function set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── Apply updated_at triggers ────────────────────────────────────────────────
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_order_tracking_updated_at
  BEFORE UPDATE ON order_tracking
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ── Profile auto-create on signup ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ── Order number sequence ────────────────────────────────────────────────────

-- Sequence starts at 10000, increments by 1, never wraps
CREATE SEQUENCE order_number_seq
  START WITH 10000
  INCREMENT BY 1
  NO MAXVALUE
  NO CYCLE;

-- Trigger function: generates ALB-XXXXX order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_val BIGINT;
BEGIN
  next_val := nextval('order_number_seq');
  NEW.order_number := 'ALB-' || LPAD(next_val::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION set_order_number();
