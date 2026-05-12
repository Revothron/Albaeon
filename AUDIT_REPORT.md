# Albaeon — Full Technical Audit Report

**Date:** 2026-05-10
**Auditor:** AI Code Review
**Scope:** Complete platform audit across 15 dimensions

---

## SECTION 1 — PROJECT STRUCTURE

### Root Structure
| Item | Status | Notes |
|------|--------|-------|
| `app/` | Present | Next.js App Router |
| `components/` | Present | Split into `admin/`, `customer/`, `ui/` |
| `lib/` | Present | 14 modules across subdirectories |
| `hooks/` | **Missing** | Not created — not strictly needed yet |
| `store/` | Present | 5 Zustand stores |
| `types/` | Present | Single `index.ts` |
| `emails/` | Present | 6 React Email templates |
| `public/` | Present | Images, favicon, OG default |
| `styles/` | **Missing** | Globals CSS used instead (acceptable) |

### Route Groups
| Route Group | Path | Status |
|-------------|------|--------|
| Customer | `app/(customer)/` | Present |
| Auth | `app/(auth)/` | Present |
| Admin | `app/admin/` | **Not wrapped in `(admin)` group** — minor inconsistency, functional |

### Customer Pages
| Page | Path | Status |
|------|------|--------|
| Home | `(customer)/page.tsx` | Present |
| Shop | `(customer)/shop/page.tsx` | Present |
| Category | `(customer)/shop/[category]/page.tsx` | Present |
| Product | `(customer)/shop/product/[slug]/page.tsx` | Present |
| Cart | `(customer)/cart/page.tsx` | Present |
| Checkout — Delivery | `(customer)/checkout/delivery/page.tsx` | Present |
| Checkout — Payment | `(customer)/checkout/payment/page.tsx` | Present |
| Checkout — Confirmation | `(customer)/checkout/confirmation/page.tsx` | Present |
| Track Order | `(customer)/track-order/page.tsx` | Present |
| Account — Orders | `(customer)/account/orders/page.tsx` | Present |
| Account — Order Detail | `(customer)/account/orders/[id]/page.tsx` | Present |
| Account — Addresses | `(customer)/account/addresses/page.tsx` | Present |
| Account — Profile | `(customer)/account/profile/page.tsx` | Present |
| Account — Root | `(customer)/account/page.tsx` | Present |
| Wishlist | `(customer)/wishlist/page.tsx` | Present |
| Search | `(customer)/search/page.tsx` | Present |
| About | `(customer)/about/page.tsx` | Present |
| Contact | `(customer)/contact/page.tsx` | Present |
| Login | `(auth)/login/page.tsx` | Present |
| Register | `(auth)/register/page.tsx` | Present |
| Forgot Password | `(auth)/forgot-password/page.tsx` | Present |
| Reset Password | `(auth)/reset-password/page.tsx` | Present |
| Privacy Policy | `(customer)/privacy-policy/page.tsx` | Present |
| Terms | `(customer)/terms/page.tsx` | Present |
| Shipping Policy | `(customer)/shipping-policy/page.tsx` | Present |
| Return Policy | `(customer)/return-policy/page.tsx` | Present |

**All customer pages present.**

### Admin Pages
| Page | Path | Status |
|------|------|--------|
| Dashboard | `admin/page.tsx` | Present |
| Products List | `admin/products/page.tsx` | Present |
| Product New | `admin/products/new/page.tsx` | Present |
| Product Edit | `admin/products/[id]/page.tsx` | Present |
| Orders List | `admin/orders/page.tsx` | Present |
| Order Detail | `admin/orders/[id]/page.tsx` | Present |
| Coupons | `admin/coupons/page.tsx` | Present |
| Customers | `admin/customers/page.tsx` | Present |
| Customer Detail | `admin/customers/[id]/page.tsx` | Present |
| Analytics Overview | `admin/analytics/page.tsx` | Present |
| Analytics Revenue | `admin/analytics/revenue/page.tsx` | Present |
| Analytics Orders | `admin/analytics/orders/page.tsx` | Present |
| Analytics Products | `admin/analytics/products/page.tsx` | Present |
| Analytics Categories | `admin/analytics/categories/page.tsx` | Present |
| Analytics Coupons | `admin/analytics/coupons/page.tsx` | Present |
| Support | `admin/support/page.tsx` | Present |
| Support Detail | `admin/support/[id]/page.tsx` | Present |
| Marketing | `admin/marketing/page.tsx` | Present |

**All admin pages present.**

### API Routes
| Route | Path | Status |
|-------|------|--------|
| Create Payment | `api/payments/razorpay/route.ts` | Present |
| Verify Payment | `api/payments/verify/route.ts` | Present |
| Razorpay Webhook | `api/webhooks/razorpay/route.ts` | Present |
| Gelato Webhook | `api/webhooks/gelato/route.ts` | Present |
| Fulfill — Banian | `api/fulfill/banian/route.ts` | Present |
| Fulfill — Gelato | `api/fulfill/gelato/route.ts` | Present |
| Image Upload | `api/images/upload/route.ts` | Present |
| Support Reply | `api/support/reply/route.ts` | Present |
| Support Auto-reply | `api/support/autoreply/route.ts` | Present |
| Coupon Validate | `api/coupons/validate/route.ts` | Present |
| Order Cancel | `api/order/cancel/route.ts` | Present |
| Auth Callback | `api/auth/callback/route.ts` | Present |
| Auth Welcome | `api/auth/welcome/route.ts` | Present |
| Admin Products | `api/admin/products/route.ts` | Present |
| Admin Orders | `api/admin/orders/route.ts` | Present |
| Admin Coupons | `api/admin/coupons/route.ts` | Present |
| Admin Analytics | `api/admin/analytics/route.ts` | Present |
| Admin Gelato Order | `api/admin/gelato/order/route.ts` | Present |
| Admin Gelato Template | `api/admin/gelato/template/route.ts` | Present |
| Admin Maintenance | `api/admin/maintenance/route.ts` | Present |
| Admin Notify Product | `api/admin/notify-product/route.ts` | Present |

**All planned API routes present.**

### Components Directory
| Directory | Status | Notes |
|-----------|--------|-------|
| `components/ui/` | Present | Contains `product/` subdirectory |
| `components/ui/product/` | Present | Product UI components |
| `components/layout/` | **Missing** | Layout components placed in `components/customer/` instead |
| `components/product/` | **Missing** | Product components in `components/customer/` |
| `components/cart/` | **Missing** | Cart components in `components/customer/cart/` |
| `components/customer/` | Present | Navbar, Footer, product views, checkout, cart |
| `components/admin/` | Present | 14 admin components |

### Libraries (lib/)
| Module | Status | Notes |
|--------|--------|-------|
| `lib/supabase/client.ts` | Present | Browser client |
| `lib/supabase/server.ts` | Present | Server component client |
| `lib/supabase/admin.ts` | Present | Service role client |
| `lib/supabase/middleware.ts` | Present | Session middleware |
| `lib/supabase/queries/categories.ts` | Present | |
| `lib/supabase/queries/products.ts` | Present | |
| `lib/cloudinary.ts` | Present | Upload, delete, URL optimisation |
| `lib/r2.ts` | **Missing** | R2 declared in `.env.example` but no lib module |
| `lib/redis.ts` | Present | Full cache layer with KEYS + TTL constants |
| `lib/resend.ts` | Present | Resend client + FROM/SUPPORT constants |
| `lib/razorpay.ts` | **Missing** | Razorpay initialised inline in routes instead |
| `lib/gelato.ts` | Present | Full API client |
| `lib/banian.ts` | Present | Google Form submission |
| `lib/ratelimit.ts` | Present | 4 rate limiters |
| `lib/emails.ts` | Present | 6 email send functions |
| `lib/invoice.tsx` | Present | PDF invoice via @react-pdf/renderer |
| `lib/maintenance.ts` | Present | JSON-file-based toggle |
| `lib/admin/analytics.ts` | Present | SQL-based aggregation |
| `lib/admin/orders.ts` | Present | Full order CRUD |
| `lib/admin/products.ts` | Present | Product management |
| `lib/admin/coupons.ts` | Present | Coupon CRUD |
| `lib/admin/customers.ts` | Present | Customer queries |
| `lib/admin/dashboard.ts` | Present | Dashboard stats |
| `lib/auth/require-admin.ts` | Present | API route guard |
| `lib/auth/require-admin-page.ts` | Present | Page guard |
| `lib/customer/products.ts` | Present | Product queries + mapping |

### Zustand Stores
| Store | Path | Status |
|-------|------|--------|
| Cart | `store/cartStore.ts` | Present + persisted |
| Wishlist | `store/wishlistStore.ts` | Present + persisted + Supabase sync |
| Checkout | `store/checkoutStore.ts` | Present + persisted |
| UI | `store/uiStore.ts` | Present (not persisted) |
| Tracking | `store/trackingStore.ts` | Present + persisted |

### Email Templates
| Template | Status | Notes |
|----------|--------|-------|
| Order Confirmation | Present | Fully styled with Albaeon branding |
| Order Shipped | Present | Fully styled |
| Order Delivered | **Missing** | Not created |
| Password Reset | **Missing** | Not created |
| Email Verify | **Missing** | Not created |
| Support Auto-reply | Present | Fully styled |
| Support Reply | Present | Fully styled |
| Welcome | Present | Fully styled |
| New Product | Present | Fully styled |

### Score: 8/10
**Issues:** Missing email templates (Order Delivered, Password Reset, Email Verify), R2 lib not implemented, no Razorpay lib module, lacking hooks/ directory, admin not in `(admin)` group.

---

## SECTION 2 — DESIGN SYSTEM COMPLIANCE

### Colour System — Token Coverage

| Token | Spec | Implementation | Status |
|-------|------|----------------|--------|
| `--bg-main` | `#241A33` | `--bg-main: var(--albaeon-bg-primary, #241A33)` | Present |
| `--bg-secondary` | `#1A1426` | `--bg-secondary: var(--albaeon-bg-secondary, #1A1426)` | Present |
| `--surface-card` | `#2C2040` | `--surface-card: var(--albaeon-surface, #2C2040)` | Present |
| `--gold` | `#E6C979` | `--gold: var(--albaeon-gold, #E6C979)` | Present |
| `--gold-hover` | `#D4B25F` | `--gold-hover: var(--albaeon-gold-hover, #D4B25F)` | Present |
| `--nav-bg` | `#130F18` | `--nav-bg: var(--albaeon-nav, #130F18)` | Present |
| `--footer-bg` | `#0F0C14` | `--footer-bg: var(--albaeon-footer, #0F0C14)` | Present |
| `--text-primary` | `#E8E2D6` | `--text-primary: var(--albaeon-text-primary, #E8E2D6)` | Present |
| `--text-muted` | `#B7AFC3` | `--text-muted: var(--albaeon-text-muted, #B7AFC3)` | Present |
| `--btn-secondary-hover` | `#3A2952` | `--btn-secondary-hover: #3A2952` | Present |
| `--status-success` | `#4CAF7D` | `--status-success: #4CAF7D` | Present |
| `--status-warning` | `#E6A817` | `--status-warning: #E6A817` | Present |
| `--status-error` | `#C0392B` | `--status-error: #C0392B` | Present |
| `--status-info` | `#4A90C4` | `--status-info: #4A90C4` | Present |

**Token coverage: 14/14 — 100%**

### Colour Hardcoding
All components reference CSS variables via `var(--token)` pattern. No raw hex values found in component code. The `globals.css` utility classes (`.btn-primary`, `.btn-secondary`, etc.) use variable references.

**Pass — no hardcoded colour violations.**

### Typography

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Cinzel loaded | Via `adminFonts.ts` + direct `next/font/google` import in `page.tsx` | Present |
| Cormorant Garamond loaded | Via `adminFonts.ts` only | **Partially loaded** |
| Raleway loaded | Via `adminFonts.ts` only | **Partially loaded** |
| Root layout font variables | `--font-manrope`, `--font-geist-mono` only | **Mismatch** |
| Tailwind `@theme` fontFamily | `--font-sans: var(--font-manrope)` only | **Missing Cinzel/Cormorant** |
| Cinzel for labels/buttons | Used in `.btn-primary`, `.btn-secondary`, `.btn-danger` | Present |
| Cormorant for headings | Used in admin components | Partial (not in root layout) |
| Raleway for body/admin UI | Used in admin components | Partial |
| Letter-spacing: 3px Cinzel buttons | `.btn-primary`, `.btn-secondary`, `.btn-danger` set `letter-spacing: 3px` | Present |
| Letter-spacing: 10px Cinzel uppercase | Not found | **Missing/not used** |

### Font Loading Architecture Issue
The root `layout.tsx` only loads **Manrope** and **Geist Mono**. The plan specified **Cinzel, Cormorant Garamond, and Raleway** as brand fonts. Currently:
- Customer pages import Cinzel directly via `next/font/google` in each component
- Admin pages use `adminFonts.ts` which loads Cinzel, Cormorant, Raleway
- Root layout loads Manrope as the sans-serif fallback
- No global `--font-cinzel`, `--font-cormorant`, `--font-raleway` CSS variables are set in the root layout

This will cause cumulative layout shift (CLS) on customer pages as Cinzel fonts load lazily per-component.

### Component Design Rules
| Rule | Status |
|------|--------|
| Primary button: transparent bg, gold border, hover inverted | Implemented in `.btn-primary` |
| Secondary button: surface-card bg, no border | Implemented in `.btn-secondary` |
| Danger button: transparent bg, error border | Implemented in `.btn-danger` |
| Cards: surface-card bg, gold border | Implemented via `.card-surface` |
| Loading states: gold ring spinner | Implemented via `.btn-loading::after` |
| Focus visible: gold outline | Implemented via `:focus-visible` |

### Score: 7/10
**Issues:** Font architecture split across files, Manrope instead of Raleway for body, no global font variables in root layout, missing Tailwind fontFamily tokens for brand fonts, 10px letter-spacing not implemented.

---

## SECTION 3 — AUTHENTICATION & SECURITY

### Auth Setup

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Supabase Auth configured | Present | `lib/supabase/client.ts`, `server.ts`, `admin.ts` |
| Email/password auth | Present | Register page at `(auth)/register/page.tsx` |
| Google OAuth | Likely present | Auth callback at `api/auth/callback/route.ts` |
| Middleware protects `/account/*` | Present | `middleware.ts` matcher includes `/account/:path*` |
| Middleware protects `/admin/*` | Present | Matcher includes `/admin/:path*` |
| Middleware protects `/checkout/*` | Present | Matcher includes `/checkout/:path*` |
| Admin role check on API routes | Present | `require-admin.ts` called in analytics, support routes |
| Admin role check on admin pages | Present | `require-admin-page.ts` called in dashboard |
| HttpOnly/Secure/SameSite cookies | Via `@supabase/ssr` | Automatic |
| Email verification enforced | Not explicitly verified in code | **Cannot confirm** |

### Admin Route Auth Patterns
- **`lib/auth/require-admin.ts`**: Returns 401 if not authenticated, 403 if not admin. Used by: analytics API, support reply API.
- **`lib/auth/require-admin-page.ts`**: Redirects to `/login` if not authenticated, `/` if not admin. Used by: dashboard page.
- **Inline checks** in `app/api/admin/products/route.ts`, `app/api/admin/orders/route.ts`, `app/api/images/upload/route.ts`: 401/403 pattern matching profile.role.

**Consistency issue**: Some admin routes use `require-admin()` helper, others inline the check. All functionally correct but different patterns.

### Webhook Security
| Endpoint | Signature Verification | Implementation |
|----------|----------------------|----------------|
| `/api/webhooks/razorpay` | HMAC-SHA256 | `crypto.timingSafeEqual` — properly implemented |
| `/api/webhooks/gelato` | HMAC-SHA256 | `crypto.timingSafeEqual` — properly implemented |
| `/api/payments/verify` | HMAC-SHA256 (client-side callback) | Properly implemented |

**All webhook endpoints verify signatures.**

### API Security

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Rate limiting — checkout (20/min) | Present | `checkoutRatelimit` in `ratelimit.ts` |
| Rate limiting — browse (60/min) | Present | `browseRatelimit` in `ratelimit.ts` |
| Rate limiting — auth (5/min) | Present | `authRatelimit` in `ratelimit.ts` |
| Rate limiting — support (10/min) | Present | `supportRatelimit` in `ratelimit.ts` |
| Zod validation on API inputs | Present | Every API route uses `z.safeParse()` |
| `INTERNAL_API_SECRET` on fulfill routes | Present | `/api/fulfill/banian` and `/api/fulfill/gelato` check header |
| CORS restricted to albaeon.com | Present | `Access-Control-Allow-Origin: NEXT_PUBLIC_SITE_URL` |
| `dangerouslySetInnerHTML` used | **Not found** | Confirmed clean |

### Security Headers

| Header | Present | Value |
|--------|---------|-------|
| Strict-Transport-Security | Yes | `max-age=63072000; includeSubDomains; preload` |
| X-Frame-Options | Yes | `DENY` |
| X-Content-Type-Options | Yes | `nosniff` |
| Referrer-Policy | Yes | `strict-origin-when-cross-origin` |
| Permissions-Policy | Yes | Camera/microphone/geolocation denied, payment allowed |
| Content-Security-Policy | Yes | Comprehensive allowlist |

### CSP Allowlist Coverage
| Service | CSP Entry | Status |
|---------|-----------|--------|
| Razorpay | `https://checkout.razorpay.com https://cdn.razorpay.com https://*.razorpay.com` | Present |
| Cloudinary | `https://res.cloudinary.com` | Present |
| Supabase | `https://*.supabase.co` | Present |
| Upstash | `https://*.upstash.io` | Present |
| Resend | `https://api.resend.com` | Present |
| Gelato | `https://api.gelato.com` | Present |
| Google Fonts | `https://fonts.googleapis.com https://fonts.gstatic.com` | Present |

### Payment Security
| Requirement | Status |
|-------------|--------|
| Amount recalculated server-side | Present — Razorpay order created server-side with Zod-validated amount |
| Idempotency check on webhook | Present — checks by `payment_id` before creating order |
| Key secret never exposed to client | Present — `RAZORPAY_KEY_SECRET` server-only |
| Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` on frontend | Present |

### Score: 9/10
**Issues:** Inconsistent admin auth pattern (helper vs inline), cannot confirm email verification enforcement. Otherwise strong.

---

## SECTION 4 — DATABASE & RLS

### Tables (from migration 20240101000000_schema.sql)

| Table | Status | Row Count Security |
|-------|--------|-------------------|
| `profiles` | Present | RLS enabled |
| `addresses` | Present | RLS enabled |
| `categories` | Present | RLS enabled |
| `products` | Present | RLS enabled |
| `product_variants` | Present | RLS enabled |
| `product_images` | Present | RLS enabled |
| `orders` | Present | RLS enabled |
| `order_items` | Present | RLS enabled |
| `order_tracking` | Present | RLS enabled |
| `coupons` | Present | RLS enabled |
| `wishlists` | Present | RLS enabled |
| `support_tickets` | Present | RLS enabled |
| `support_replies` | Present | RLS enabled |
| `webhook_logs` | Present | RLS enabled |

### Schema Completeness
- `order_number` format: `ALB-XXXXX` via DB sequence starting at 10000 — **present**
- `shipping_address_snapshot` JSONB on orders — **present**
- Product name, SKU, color, size snapshots on `order_items` — **present**
- 11 enum types — **all present**

### Indexes (from migration 20240101000001_indexes.sql)
All planned indexes verified in migration file:
- `products.slug` UNIQUE, `products(category_id, status)`, `products(is_new_arrival, status)`, `products(is_best_soldier, status)`
- `orders(user_id, created_at DESC)`, `orders.order_number` UNIQUE, `orders.status`, `orders.payment_status`
- `order_items.order_id`, `product_variants.product_id`, `product_variants(product_id, sku)` UNIQUE
- `wishlists.user_id`, `wishlists(user_id, product_id)` UNIQUE
- `support_tickets(status, created_at DESC)`
- Full-text search indexes on `products(name, description)`, `products(tags)`

**All indexes present — 30 total.**

### RLS Policies (from migration 20240101000002_rls.sql)
| Table | Read | Insert | Update | Delete |
|-------|------|--------|--------|--------|
| profiles | Own + admin | Trigger-only | Own + admin | Admin |
| addresses | Own + admin | Own | Own | Own |
| categories | Public | Admin | Admin | Admin |
| coupons | Active + admin | Admin | Admin | Admin |
| products | Active + admin | Admin | Admin | Admin |
| product_variants | Via visible products | Admin | Admin | Admin |
| product_images | Via visible products | Admin | Admin | Admin |
| orders | Own + admin | Service role | Admin | — |
| order_items | Via own orders | Admin | Admin | — |
| order_tracking | Via own orders | Admin | Admin | — |
| wishlists | Own | Own | — | Own |
| support_tickets | Own + admin | Anyone | Admin | — |
| support_replies | Via own tickets | Admin | — | — |
| webhook_logs | Admin | — | Admin | — |

### Missing Updated At on `addresses`
The `addresses` table has no `updated_at` column in schema, and no trigger. The TypeScript `Address` interface defines `updated_at: string` but the DB column doesn't exist. This will cause SELECT failures if code queries `updated_at` on addresses.

### Triggers (from migration 20240101000003_triggers.sql)
| Trigger | Table | Status |
|---------|-------|--------|
| `set_profiles_updated_at` | profiles | Present |
| `set_products_updated_at` | products | Present |
| `set_orders_updated_at` | orders | Present |
| `set_order_tracking_updated_at` | order_tracking | Present |
| `set_support_tickets_updated_at` | support_tickets | Present |
| `on_auth_user_created` (profile auto-create) | auth.users | Present |
| `assign_order_number` (ALB-XXXXX) | orders | Present |

### Client Usage
| Client | Used For | Status |
|--------|----------|--------|
| `lib/supabase/client.ts` (anon browser) | Client-side queries | Correct |
| `lib/supabase/server.ts` (anon server) | Server Components | Correct |
| `lib/supabase/admin.ts` (service role) | API routes | Correct — never imported on client |

### Score: 9/10
**Issues:** Addresses table missing `updated_at` column (TS/DB mismatch), no admin DELETE policy on orders/wishlists (minor).

---

## SECTION 5 — PAYMENT IMPLEMENTATION

### Razorpay Flow

| Step | Implementation | Status |
|------|----------------|--------|
| Create order | `POST /api/payments/razorpay` — Zod validated, amount in paise, server-side | Present |
| Frontend modal | Checkout component integrates Razorpay checkout | Present |
| Payment verification | `POST /api/payments/verify` — HMAC-SHA256 signature check | Present |
| Webhook `payment.captured` | `POST /api/webhooks/razorpay` — processes order creation | Present |
| Webhook `payment.failed` | `POST /api/webhooks/razorpay` — **no specific `payment.failed` handler** | **Partial** |
| Order status → paid | Updated in webhook handler | Present |
| Fulfilment triggered | After order creation, triggers Banian or Gelato | Present |
| Confirmation email | Sent after order creation | Present |
| Idempotency | Check by `payment_id` before duplicate processing | Present |

### Currency Handling
- Orders created with `currency: 'INR'` hardcoded in webhook — **Razorpay International Support**
- Razorpay order creation route accepts `currency` parameter
- The webhook always sets `currency: 'INR'` regardless of actual payment currency
- **Potential issue**: International customers paying via Razorpay International (USD/other) would have their order stored as INR

### Gaps
- **No explicit `payment.failed` event handler**: The webhook processes all events generically. Failed payment events would not trigger specific handling (order status update, email notification).
- **Currency hardcoded to INR**: The webhook at line 90 sets `currency: 'INR'`. If Razorpay International is used with non-INR currencies, this creates a mismatch between actual payment currency and stored order currency.
- **Stripe still in enum**: `payment_gateway` enum includes `'stripe'` but no Stripe code exists. Clean dead value.

### Score: 7/10
**Issues:** No specific `payment.failed` webhook handling, currency hardcoded to INR, no Stripe implementation despite enum value.

---

## SECTION 6 — FULFILMENT INTEGRATION

### Banian City (India POD)

| Requirement | Status | Notes |
|-------------|--------|-------|
| `lib/banian.ts` with HTTP POST | Present | Uses `URLSearchParams` to Google Form |
| All required form fields mapped | Present | Order number, name, phone, address, city, state, pincode, SKU, color, size, quantity |
| Entry IDs configurable via env | Present | `BANIAN_FIELD_*` env vars |
| Retry logic (3 attempts, 5s delay) | Present | `while (attempt < 3 && !success)` with 5s timeout |
| Response logged to tracking | Present | `banian_form_response` upserted to `order_tracking` |
| Admin alert on repeated failure | **Missing** | Only logs to console via `console.error('Banian partial failure:', results)` |

### Gelato (International POD)

| Requirement | Status | Notes |
|-------------|--------|-------|
| `lib/gelato.ts` with createOrder | Present | Full Gelato API client |
| Template variant fetching | Present | `getGelatoTemplateVariants()` with store products endpoint |
| Order payload per spec | Present | Includes items, shipping address, return address, currency |
| Webhook processing | Present | `POST /api/webhooks/gelato` — processes status updates |
| Tracking stored after order creation | Present | `gelato_order_id` saved to `order_tracking` |
| Webhook events logged | Present | Inserted into `webhook_logs` |
| Duplicate fulfilment check | Present | Checks `existingTracking?.gelato_order_id` before processing |
| Cancel order support | Present | `cancelGelatoOrder()` in `lib/gelato.ts` |

### Score: 7/10
**Issues:** No admin alert on Banian failure (console.error only), Banian address mapping doesn't include `line2` field (only `line1` is mapped), `address.line2` exists in the order function signature but the form URL doesn't include a field for it.

---

## SECTION 7 — CUSTOMER STOREFRONT

### Page Completion

| Page | Feature Completeness | Status |
|------|---------------------|--------|
| Homepage | Hero section (priority image), New Arrivals grid (4), Best Sellers grid (4), Category cards (3), Story section | Present |
| Collection | Product grid, sort dropdown, color filter, price filter, pagination (24/page) | Present |
| Product Detail | Image gallery, size/color selector, qty selector, add to cart, wishlist toggle, description, wash care, size chart, highlights | Present (via `ProductView.tsx` + `ShopCollectionView.tsx`) |
| Cart | Add/remove/update qty, subtotal, coupon input, checkout CTA, recommended products | Present (via `CartPageClient.tsx`) |
| Checkout — Delivery | Address form with validation, saved address selection | Present (via `DeliveryForm.tsx`) |
| Checkout — Payment | Razorpay modal integration, order summary | Present (via `PaymentContent.tsx`) |
| Checkout — Confirmation | Order number display, order summary | Present (via `ConfirmationContent.tsx`) |
| Track Order | Search by order number | Present |
| Account — Orders | Order history list | Present |
| Account — Order Detail | Full order view with tracking link, cancel button, invoice download | Present |
| Account — Addresses | Add/edit/delete/set default | Present (via `AddressesClient.tsx`) |
| Account — Profile | Edit profile | Present |
| Wishlist | Full CRUD with Supabase sync | Present |
| Search | Search page | Present |
| Login | Email/password + Google OAuth | Present |
| Register | Registration form | Present |
| Forgot Password | Email reset flow | Present |
| Reset Password | New password form | Present |

### Components

| Component | Requirement | Status |
|-----------|-------------|--------|
| Navbar | Logo, collections dropdown, cart count, wishlist count, account link, mobile menu | Present — reactive via Zustand stores |
| Footer | Navigation links, legal links, brand messaging | Present |
| AnnouncementBar | Top announcement bar | Present |
| Toast Container | Toast notifications | Present |
| Wishlist Sync | Syncs wishlist to Supabase on login | Present (`WishlistSync.tsx`) |
| Cart persistence | Zustand persist to localStorage | Present |
| Wishlist persistence | Zustand persist to localStorage + Supabase merge | Present |

### UX Gaps
- **Navbar categories hardcoded**: `shopCategories` array includes "Oversized Tees", "Drop Shoulder Fits", "Crop Tees", "Future Categories" — these are not real DB categories. The DB only has: `t-shirts`, `hoodies`, `shirts`, `pants`, `jackets`, `sets`
- **Hero image missing**: References `/home/hero.png` — must exist in `public/home/`

### Score: 8/10
**Issues:** Navbar categories don't match DB categories, some UX polish gaps.

---

## SECTION 8 — ADMIN PANEL

### Module Completion

| Module | Features | Status |
|--------|----------|--------|
| Dashboard | Stat cards (4), sales chart (SVG), recent orders table, quick stats sidebar | Present |
| Products | Table with search, status filter, edit/delete | Present |
| Product Add/Edit | All fields with Cloudinary upload, variant management, size chart JSONB, SEO fields, highlights | Present |
| Orders | Table with status/date/provider filters, search by order number, pagination | Present |
| Order Detail | Customer info, address snapshot, items, payment info, tracking input, mark shipped action | Present |
| Coupons | Create/edit/delete with all fields | Present |
| Customers | List with search, customer detail with order history | Present |
| Support Inbox | Two-panel layout, ticket list with status badges, reply composer, mark resolved | Present |
| Analytics Overview | Chart + KPIs | Present |
| Analytics Revenue | Chart + period table | Present |
| Analytics Orders | Chart + AOV + recent orders | Present |
| Analytics Products | Top products table + chart | Present |
| Analytics Categories | Category stats table + chart | Present |
| Analytics Coupons | Usage stats table + chart | Present |
| Marketing | Links/external tools page | Present |

### Admin Component Architecture
- `AdminUi.tsx`: Shared UI primitives (page heading, buttons, badges, pills, pagination, text inputs, selects)
- `AdminProductEditor.tsx` + `AdminProductEditorClient.tsx`: Product CRUD
- `AdminOrdersClient.tsx`: Order management
- `AdminCouponsClient.tsx`: Coupon management
- `AdminCustomersClient.tsx`: Customer management
- `AdminSupportInbox.tsx`: Support ticket management
- `AdminAnalytics.tsx`: Analytics display components (479 lines — comprehensive)
- `AdminSidebar.tsx`: Navigation sidebar
- `AdminHeader.tsx`: Top header bar
- `AdminLoginView.tsx`: Admin login

### Analytics SQL RPCs (migration 20260508000000)
Six RPCs created: `get_revenue_by_period`, `get_revenue_breakdown`, `get_products_sold_count`, `get_top_products`, `get_category_stats`, `get_order_count_by_period`, `get_coupon_usage_stats`.

### Score: 8/10
**Issues:** No admin notification system for Banian failures, no bulk order actions, analytics data is real but chart labels are hardcoded on dashboard (₹100k, ₹80k etc — not dynamic).

---

## SECTION 9 — EMAIL SYSTEM

### Configuration
- `lib/resend.ts`: Resend client initialised with `RESEND_API_KEY`
- `FROM_EMAIL`: `process.env.EMAIL_FROM ?? 'onboarding@resend.dev'` — configured via env
- `SUPPORT_EMAIL`: `process.env.EMAIL_SUPPORT ?? 'support@albaeon.com'`

### Templates
| Template | Present | Usage | Trigger |
|----------|---------|-------|---------|
| OrderConfirmation | Yes | `sendOrderConfirmation()` in `lib/emails.ts` | Payment webhook (`payment.captured`) |
| OrderShipped | Yes | `sendOrderShipped()` in `lib/emails.ts` | Admin marks shipped + Gelato tracking |
| OrderDelivered | **No** | Not implemented | Not triggered |
| PasswordReset | **No** | Not implemented | Not triggered |
| EmailVerify | **No** | Not implemented | Not triggered |
| SupportAutoReply | Yes | `sendSupportAutoReply()` | Via `/api/support/autoreply` |
| SupportReply | Yes | `sendSupportReply()` | Via `/api/support/reply` |
| Welcome | Yes | `sendWelcomeEmail()` | Via `/api/auth/welcome` |
| NewProduct | Yes | `sendNewProductNotification()` | Via `/api/admin/notify-product` |

### Email Branding
All templates use:
- Background: `#241A33` (--bg-main)
- Gold accents: `#E6C979` for headings
- Text: `#E8E2D6` / `#B7AFC3`
- CTA buttons: Gold background with dark text
- Font: Georgia serif (web-safe fallback)
- Footer with © 2026 Albaeon · Kerala, India

### Score: 6/10
**Issues:** Missing 3 critical transactional email templates (password-reset, email-verify, order-delivered), `from` address falls back to `onboarding@resend.dev` if env not set, no SPF/DKIM/DMARC documentation.

---

## SECTION 10 — CACHING STRATEGY

### ISR Revalidation

| Page | Setting | Status |
|------|---------|--------|
| Homepage | `revalidate = 300` (5 min) | Present |
| Category/Collection | `revalidate = 300` (5 min) | Present |
| Product Detail | Not explicitly set | **Missing** |
| Policy pages (about, privacy, etc.) | Not explicitly set | **Missing** |
| Admin pages | `dynamic = 'force-dynamic'` | Present |
| Checkout pages | `dynamic = 'force-dynamic'` | Present (cart page) |

### Redis Caching

| Cache | Key | TTL | Status |
|-------|-----|-----|--------|
| Product catalogue | `products:all:active` | 300s (5 min) | Present |
| Product by slug | `product:{slug}` | 600s (10 min) | Present |
| Products by category | `products:category:{slug}` | 300s (5 min) | Present |
| Categories | `categories:all` | 900s (15 min) | Present |
| Coupon | `coupon:{code}` | 60s | Present |
| Cart | (localStorage via Zustand) | N/A | Present |

### Cache Invalidation
- Product updates trigger: `cacheDel(CACHE_KEYS.products())` and `cacheDel(CACHE_KEYS.product(slug))`
- Coupon validation triggers: `cacheDel(cacheKey)` after validation
- Admin product API invalidates cache after create/delete

### Cloudinary
- Images served via Cloudinary with `fetch_format: 'auto'` and `quality: 'auto'`
- Next.js `_next/image` has `Cache-Control: public, max-age=31536000, immutable`

### Score: 7/10
**Issues:** Product detail page missing explicit `revalidate`, policy pages missing `revalidate` (should be static or long TTL), no cache invalidation on order status changes (for admin dashboard).

---

## SECTION 11 — PERFORMANCE

### Image Optimisation

| Practice | Status | Evidence |
|----------|--------|----------|
| `next/image` used for product images | Present | Homepage, product cards |
| Hero image has `priority={true}` | Present | Homepage hero |
| Image dimensions specified | Partially | `fill` prop used with `sizes` attribute (acceptable) |
| Cloudinary auto-format/quality | Present | `fetch_format: 'auto'`, `crop: 'fill'` |

### Code Splitting
| Practice | Status |
|----------|--------|
| Razorpay loaded only on payment page | Likely (inline import in payment content) |
| Admin chart scripts lazy loaded | Not explicitly verified — AdminAnalytics is a client component |

### Query Performance
| Practice | Status | Evidence |
|----------|--------|----------|
| Specific column selection | Present | All queries use `.select('col1, col2, ...')` |
| Pagination enforced (max 24) | Present | `limit: 24` in product queries, `limit: 25` in admin orders |
| Analytics moved to SQL RPCs | Present | 7 RPCs in migration |
| No `SELECT *` found | Clean | Verified across all query files |
| All required indexes created | Present | 30 indexes across 14 tables |

### Admin Performance
- Admin orders page queries use `.range(offset, offset + limit - 1)` for pagination
- Admin analytics uses SQL RPCs to avoid loading all rows into JS memory
- Dashboard fetches real order stats from DB (not cached — `force-dynamic`)

### Score: 8/10
**Issues:** Admin dashboard loads dynamic data every request (no cache), product detail page revalidation not set, analytics chart data could benefit from Redis caching.

---

## SECTION 12 — SEO IMPLEMENTATION

| Requirement | Status | Notes |
|-------------|--------|-------|
| Metadata in root layout | Present | Title template, description, keywords, OG, Twitter |
| Metadata in key pages | Present | Homepage, category, product |
| Dynamic metadata for products | Present | `generateMetadata` in category page |
| Dynamic metadata for product detail | Assumed present | Via shop/product/[slug] |
| `app/sitemap.ts` — dynamic | Present | Includes static, category, and product routes |
| `app/robots.ts` — disallow admin/checkout/account | Present | All three disallowed + `/api/` |
| Canonical tags | Present | Set on homepage and category pages |
| Open Graph tags | Present | Title, description, image, URL |
| Twitter card `summary_large_image` | Present | Set in root layout |
| JSON-LD structured data | **Not confirmed** | Not found in reviewed files |
| Custom 404 page | Present | `app/not-found.tsx` with navigation links |
| `lang="en"` on HTML | Present | Root layout sets `<html lang="en">` |

### Score: 8/10
**Issues:** JSON-LD Product structured data not confirmed, no breadcrumb structured data for category/product pages.

---

## SECTION 13 — ENVIRONMENT & CONFIGURATION

### `.env.example` Completeness

| Variable | Public/Secret | Status |
|----------|--------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Present |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Present |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret (no prefix) | Present |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public | Present |
| `CLOUDINARY_API_KEY` | Secret (no prefix) | Present |
| `CLOUDINARY_API_SECRET` | Secret (no prefix) | Present |
| `R2_*` variables | Mixed | Present (R2 not implemented in code) |
| `UPSTASH_REDIS_REST_URL` | Public | Present |
| `UPSTASH_REDIS_REST_TOKEN` | Secret (no prefix) | Present |
| `RESEND_API_KEY` | Secret (no prefix) | Present |
| `EMAIL_FROM` | Public | Present |
| `EMAIL_SUPPORT` | Public | Present |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | Present |
| `RAZORPAY_KEY_ID` | Public | Present (server-side usage) |
| `RAZORPAY_KEY_SECRET` | Secret (no prefix) | Present |
| `RAZORPAY_WEBHOOK_SECRET` | Secret (no prefix) | Present |
| `GELATO_API_KEY` | Secret (no prefix) | Present |
| `GELATO_STORE_ID` | Public | Present |
| `GELATO_WEBHOOK_SECRET` | Secret (no prefix) | Present |
| `BANIAN_FORM_URL` | Public | Present |
| `BANIAN_FIELD_*` | Public | Present |
| `INTERNAL_API_SECRET` | Secret (no prefix) | Present |
| `NEXT_PUBLIC_SITE_URL` | Public | Present |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Present |

### Secret Exposure Risk
**None found.** All secrets are without `NEXT_PUBLIC_` prefix. All public values correctly prefixed.

### `next.config.ts` Configuration

| Feature | Status |
|---------|--------|
| Cloudinary image remote pattern | Present |
| Security headers (10 headers) | Present |
| CORS on API routes | Present |
| `/shop` → `/collections` redirect | Present (but reversed — redirects `/collections` → `/shop`) |
| Server components external packages | `@supabase/supabase-js`, `@react-pdf/renderer` |

### `tsconfig.json`
- `strict: true` — **Present**
- Path alias `@/*` mapped to `./*` — **Present**

### Score: 9/10
**Issues:** R2 variables documented but not implemented, CSP does not include `report-uri` or `report-to` for violation reporting.

---

## SECTION 14 — DEVIATIONS FROM ORIGINAL PLAN

### 1. Razorpay for Both India and International (vs Stripe for International)

| Aspect | Plan | Actual | Assessment |
|--------|------|--------|------------|
| India payments | Razorpay | Razorpay | As planned |
| International | Stripe | Razorpay International | **Sound deviation** |
| Currency | INR + USD multi-currency | INR hardcoded in webhook | **Risk** |
| Cost | Dual provider complexity | Single provider simplicity | **Benefit** |

**Assessment:** Architecturally sound. Razorpay supports international payments via Razorpay International (multi-currency). Simplifies codebase by removing Stripe dependency. **However**, the webhook at line 90 hardcodes `currency: 'INR'` — this must be updated to use the actual payment currency from the Razorpay payload when processing international orders. **Recommendation:** Keep the deviation, fix currency handling to be dynamic.

### 2. Font Architecture

| Aspect | Plan | Actual | Assessment |
|--------|------|--------|------------|
| Body font | Raleway | Manrope (root layout) | **Minor deviation** |
| Admin fonts | Raleway for UI | Cinzel + Cormorant + Raleway via adminFonts | Acceptable |
| Font loading | Global via root layout | Split across files | **Performance risk** |

**Assessment:** Manrope is a solid substitute for Raleway. The bigger concern is the split font loading architecture causing potential CLS. **Recommendation:** Load all three brand fonts in root layout, expose as CSS variables.

### 3. Admin Route Group

| Aspect | Plan | Actual | Assessment |
|--------|------|--------|------------|
| Admin path | `app/(admin)/` | `app/admin/` | **Cosmetic** — functions identically |

### 4. Hooks Directory

| Aspect | Plan | Actual | Assessment |
|--------|------|--------|------------|
| Custom hooks | `hooks/` directory | Not created | **Missing** — no React hooks found in codebase |

### 5. R2 Implementation

| Aspect | Plan | Actual | Assessment |
|--------|------|--------|------------|
| File storage | R2 for files | Not implemented | **Not needed** — Cloudinary handles images |

### 6. Navbar Categories Hardcoded

The Navbar lists categories that don't exist in the DB seed data ("Oversized Tees", "Drop Shoulder Fits", "Crop Tees", "Future Categories"). The DB only has: `t-shirts`, `hoodies`, `shirts`, `pants`, `jackets`, `sets`. This will produce 404s on navigation.

**Recommendation:** Either add these categories to the DB seed, or update the Navbar to query categories dynamically from the database.

### Score: N/A

---

## SECTION 15 — OVERALL AUDIT SUMMARY

### Summary Table

| Section | Area | Score | Status | Priority Next Steps |
|---------|------|-------|--------|-------------------|
| 1 | Project Structure | 8/10 | Solid foundation | Create missing email templates, add hooks/ |
| 2 | Design System | 7/10 | Good but fragmented | Consolidate fonts in root layout, add Tailwind fontFamily tokens |
| 3 | Authentication & Security | 9/10 | Strong | Add report-uri to CSP, verify email enforcement |
| 4 | Database & RLS | 9/10 | Excellent | Fix `addresses.updated_at` column, add admin DELETE policies |
| 5 | Payment | 7/10 | Functional with gaps | Fix currency hardcoding, add payment.failed handler |
| 6 | Fulfilment | 7/10 | Working | Add admin alert on Banian failure, add address.line2 to form |
| 7 | Customer Storefront | 8/10 | Feature-rich | Fix navbar categories to match DB, add product detail ISR |
| 8 | Admin Panel | 8/10 | Comprehensive | Add cache to dashboard, bulk actions |
| 9 | Email System | 6/10 | 3 templates missing | Create password-reset, email-verify, order-delivered templates |
| 10 | Caching Strategy | 7/10 | Good foundation | Add revalidate to product detail/policy pages |
| 11 | Performance | 8/10 | Strong | Add Redis caching for dashboard analytics |
| 12 | SEO | 8/10 | Well-implemented | Add JSON-LD structured data for products |
| 13 | Configuration | 9/10 | Excellent | Clean unused R2 vars, add CSP reporting |
| 14 | Deviations | N/A | Mostly sound | Fix currency handling in Razorpay webhook |
| **Overall** | | **7.7/10** | **Launch-ready with fixes** | |

### Overall Project Completion Estimate: **85%**

### Top 5 Critical Issues to Fix Before Launch
1. **Fix currency hardcoding in Razorpay webhook** (`app/api/webhooks/razorpay/route.ts:90`) — must use actual payment currency for international orders
2. **Fix `addresses.updated_at` mismatch** — column exists in TypeScript type but not in DB schema
3. **Fix navbar categories** — hardcoded categories don't match DB seed data, causing 404s
4. **Add `payment.failed` webhook handling** — without this, failed payments silently disappear
5. **Consolidate font loading** — split font architecture causes CLS; load Cinzel, Cormorant, Raleway in root layout

### Top 5 Missing Features for MVP
1. **Password reset email template** — auth flow incomplete without it
2. **Email verification flow** — Supabase Auth can enforce, but no template/trigger exists
3. **Order delivered email** — no post-delivery communication to customer
4. **Admin notification on fulfilment failure** — Banian failures only logged to console
5. **JSON-LD structured data** — important for product page SEO

### Estimated Effort Remaining by Phase

| Phase | Effort | Description |
|-------|--------|-------------|
| Critical fixes | 3-5 days | Currency, schema mismatch, navbar, webhook, fonts |
| Feature completion | 5-7 days | Email templates, admin notifications, JSON-LD |
| Performance tuning | 2-3 days | Redis cache for dashboard, revalidation settings |
| Polish | 3-5 days | Analytics label generation, admin UX improvements |
| Testing & QA | 5-7 days | End-to-end testing, load testing, security review |
| **Total** | **18-27 days** | |

### Launch Readiness Verdict: **Needs 3-4 weeks of work**

The platform has a strong, well-architected foundation with excellent security practices, comprehensive admin features, and a well-designed database schema. The critical issues are isolated and fixable. The email gap (3 missing templates) and the currency hardcoding bug are the two highest-priority launch blockers. With focused effort, the platform could be launch-ready in approximately 3-4 weeks.
