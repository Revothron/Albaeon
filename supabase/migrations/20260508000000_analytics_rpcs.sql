-- Analytics RPCs for moving aggregation from JavaScript to SQL

-- get_revenue_by_period: revenue and order count grouped by time period
CREATE OR REPLACE FUNCTION get_revenue_by_period(
  from_date TIMESTAMPTZ DEFAULT NULL,
  to_date   TIMESTAMPTZ DEFAULT NULL,
  period    TEXT DEFAULT 'day'
)
RETURNS TABLE (period_start TIMESTAMPTZ, revenue NUMERIC, order_count BIGINT)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    date_trunc(period, created_at) AS period_start,
    SUM(total_amount)              AS revenue,
    COUNT(*)                       AS order_count
  FROM orders
  WHERE payment_status = 'paid'
    AND (from_date IS NULL OR created_at >= from_date)
    AND (to_date IS NULL OR created_at <= to_date)
  GROUP BY date_trunc(period, created_at)
  ORDER BY period_start ASC;
$$;

-- get_revenue_breakdown: per-period gross, discount, shipping, net (revenue analytics page)
CREATE OR REPLACE FUNCTION get_revenue_breakdown(
  from_date TIMESTAMPTZ DEFAULT NULL,
  to_date   TIMESTAMPTZ DEFAULT NULL,
  period    TEXT DEFAULT 'day'
)
RETURNS TABLE (
  period_start  TIMESTAMPTZ,
  gross         NUMERIC,
  discounts     NUMERIC,
  shipping      NUMERIC,
  net           NUMERIC,
  order_count   BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    date_trunc(period, created_at)                   AS period_start,
    COALESCE(SUM(subtotal), 0)                       AS gross,
    COALESCE(SUM(discount_amount), 0)                AS discounts,
    COALESCE(SUM(shipping_amount), 0)                AS shipping,
    COALESCE(SUM(total_amount - COALESCE(discount_amount, 0)), 0) AS net,
    COUNT(*)                                          AS order_count
  FROM orders
  WHERE payment_status = 'paid'
    AND (from_date IS NULL OR created_at >= from_date)
    AND (to_date IS NULL OR created_at <= to_date)
  GROUP BY date_trunc(period, created_at)
  ORDER BY period_start ASC;
$$;

-- get_products_sold_count: total quantity of items sold in date range
CREATE OR REPLACE FUNCTION get_products_sold_count(
  from_date TIMESTAMPTZ DEFAULT NULL,
  to_date   TIMESTAMPTZ DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(SUM(oi.quantity), 0)::BIGINT
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE o.payment_status = 'paid'
    AND (from_date IS NULL OR o.created_at >= from_date)
    AND (to_date IS NULL OR o.created_at <= to_date);
$$;

-- get_top_products: top N products by revenue
CREATE OR REPLACE FUNCTION get_top_products(
  from_date  TIMESTAMPTZ DEFAULT NULL,
  to_date    TIMESTAMPTZ DEFAULT NULL,
  row_limit  INT DEFAULT 10
)
RETURNS TABLE (
  product_id    UUID,
  product_name  TEXT,
  total_sold    BIGINT,
  total_revenue NUMERIC
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    oi.product_id,
    oi.product_name,
    SUM(oi.quantity)::BIGINT         AS total_sold,
    SUM(oi.subtotal)                 AS total_revenue
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE o.payment_status = 'paid'
    AND (from_date IS NULL OR o.created_at >= from_date)
    AND (to_date IS NULL OR o.created_at <= to_date)
  GROUP BY oi.product_id, oi.product_name
  ORDER BY total_revenue DESC
  LIMIT row_limit;
$$;

-- get_category_stats: category-wise quantity and revenue
CREATE OR REPLACE FUNCTION get_category_stats(
  from_date TIMESTAMPTZ DEFAULT NULL,
  to_date   TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  category_name TEXT,
  total_sold    BIGINT,
  total_revenue NUMERIC
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    COALESCE(c.name, 'Uncategorised') AS category_name,
    SUM(oi.quantity)::BIGINT          AS total_sold,
    SUM(oi.subtotal)                  AS total_revenue
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  LEFT JOIN products p ON p.id = oi.product_id
  LEFT JOIN categories c ON c.id = p.category_id
  WHERE o.payment_status = 'paid'
    AND (from_date IS NULL OR o.created_at >= from_date)
    AND (to_date IS NULL OR o.created_at <= to_date)
  GROUP BY c.name
  ORDER BY total_sold DESC;
$$;

-- get_order_count_by_period: total order count per period (all statuses, for orders analytics chart)
CREATE OR REPLACE FUNCTION get_order_count_by_period(
  from_date TIMESTAMPTZ DEFAULT NULL,
  to_date   TIMESTAMPTZ DEFAULT NULL,
  period    TEXT DEFAULT 'day'
)
RETURNS TABLE (period_start TIMESTAMPTZ, order_count BIGINT)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    date_trunc(period, created_at) AS period_start,
    COUNT(*)                       AS order_count
  FROM orders
  WHERE (from_date IS NULL OR created_at >= from_date)
    AND (to_date IS NULL OR created_at <= to_date)
  GROUP BY date_trunc(period, created_at)
  ORDER BY period_start ASC;
$$;

-- get_coupon_usage_stats: coupon usage, discount, and revenue
CREATE OR REPLACE FUNCTION get_coupon_usage_stats(
  from_date TIMESTAMPTZ DEFAULT NULL,
  to_date   TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  coupon_code   TEXT,
  uses_count    BIGINT,
  total_discount NUMERIC,
  total_revenue NUMERIC
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    c.code                           AS coupon_code,
    COUNT(*)::BIGINT                 AS uses_count,
    COALESCE(SUM(o.discount_amount), 0) AS total_discount,
    COALESCE(SUM(o.total_amount), 0)    AS total_revenue
  FROM orders o
  JOIN coupons c ON c.id = o.coupon_id
  WHERE o.payment_status = 'paid'
    AND o.coupon_id IS NOT NULL
    AND (from_date IS NULL OR o.created_at >= from_date)
    AND (to_date IS NULL OR o.created_at <= to_date)
  GROUP BY c.code
  ORDER BY uses_count DESC;
$$;
