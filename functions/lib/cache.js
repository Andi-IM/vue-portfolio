/**
 * Cache Helper for KV-based caching layer
 *
 * Provides Redis-like caching functionality using Cloudflare Workers KV.
 * Used alongside D1 for a cache-aside pattern.
 */

// Cache TTL: 5 minutes
const CACHE_TTL = 60 * 5;

/**
 * Get a value from cache
 * @param {Object} env - Cloudflare environment bindings
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null
 */
export async function getFromCache(env, key) {
  try {
    return await env.BLOG_CACHE.get(key, { type: 'json' });
  } catch (e) {
    console.error('Cache read error:', e);
    return null;
  }
}

/**
 * Set a value in cache with TTL
 * @param {Object} env - Cloudflare environment bindings
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} [ttl] - Optional custom TTL in seconds
 */
export async function setCache(env, key, value, ttl = CACHE_TTL) {
  try {
    await env.BLOG_CACHE.put(key, JSON.stringify(value), { expirationTtl: ttl });
  } catch (e) {
    console.error('Cache write error:', e);
  }
}

/**
 * Invalidate one or more cache keys
 * @param {Object} env - Cloudflare environment bindings
 * @param {string|string[]} keys - Key or array of keys to invalidate
 */
export async function invalidateCache(env, keys) {
  const keyArray = Array.isArray(keys) ? keys : [keys];
  try {
    await Promise.all(keyArray.map((k) => env.BLOG_CACHE.delete(k)));
  } catch (e) {
    console.error('Cache invalidation error:', e);
  }
}

// Cache key constants
export const CACHE_KEYS = {
  POSTS_INDEX: 'posts_index',
  post: (id) => `post:${id}`,
};
