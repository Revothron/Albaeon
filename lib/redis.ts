import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not set');
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not set');
}

export const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value ?? null;
  } catch (err) {
    console.error('[Redis] cacheGet failed for key:', key, err);
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (err) {
    console.error('[Redis] cacheSet failed for key:', key, err);
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[Redis] cacheDel failed for key:', key, err);
  }
}

export const CACHE_KEYS = {
  products:           () => 'products:all:active',
  productsByCategory: (slug: string) => `products:category:${slug}`,
  product:            (slug: string) => `product:${slug}`,
  categories:         () => 'categories:all',
  collections:        () => 'collections:all',
  coupon:             (code: string) => `coupon:${code.toUpperCase()}`,
} as const;

export const TTL = {
  PRODUCTS:    300,
  PRODUCT:     600,
  CATEGORIES:  900,
  COLLECTIONS: 900,
  COUPON:      60,
  CART:        604800,
} as const;
