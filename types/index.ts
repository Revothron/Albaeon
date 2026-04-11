export type UserRole = 'customer' | 'admin';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ProductStatus = 'active' | 'draft';

export type PODProvider = 'banian' | 'gelato';

export type CouponType = 'percentage' | 'flat';

export type TicketStatus = 'unread' | 'pending' | 'resolved';

export type StockStatus = 'in_stock' | 'out_of_stock' | 'discontinued';

export type DesignType = 'original' | 'licensed';

export type AddressType = 'shipping' | 'billing';

export type PaymentGateway = 'razorpay' | 'stripe';

// Profile
export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Address
export interface Address {
  id: string;
  user_id: string;
  type: AddressType;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  category_id: string | null;
  price_inr: number;
  price_usd: number | null;
  status: ProductStatus;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  design_type: DesignType;
  meta_title: string | null;
  meta_description: string | null;
  wash_care: string | null;
  size_chart: Record<string, unknown> | null;
  tags: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: Category;
}

// Product Variant
export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  color_hex: string | null;
  size: string;
  sku: string;
  stock_status: StockStatus;
  sort_order: number;
  created_at: string;
}

// Product Image
export interface ProductImage {
  id: string;
  product_id: string;
  cloudinary_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

// Order
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_gateway: PaymentGateway;
  payment_id: string | null;
  provider: PODProvider;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  coupon_id: string | null;
  shipping_address_snapshot: Address;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  tracking?: OrderTracking;
}

// Order Item
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_sku: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

// Order Tracking
export interface OrderTracking {
  id: string;
  order_id: string;
  tracking_number: string | null;
  courier: string | null;
  courier_url: string | null;
  estimated_delivery: string | null;
  gelato_order_id: string | null;
  banian_form_response: Record<string, unknown> | null;
  updated_at: string;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  per_user_limit: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

// Cart Item (client-side only)
export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}