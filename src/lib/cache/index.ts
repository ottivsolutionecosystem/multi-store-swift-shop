
import { CacheProvider } from './cache-provider';
import { MemoryCache } from './memory-cache';

let provider: CacheProvider | null = null;

async function createCacheProvider(): Promise<CacheProvider> {
  if (provider) return provider;

  // Always use Memory cache in browser environment
  if (typeof window !== 'undefined') {
    provider = new MemoryCache();
    console.log('Using Memory cache provider (browser environment)');
    return provider;
  }

  // Use Redis only in server/Node.js environment (when window is undefined)
  // and not in test mode
  if (import.meta.env.MODE !== 'test') {
    try {
      // Dynamic import to prevent ioredis from being bundled for browser
      const { RedisCache } = await import('./redis-cache');
      provider = new RedisCache();
      console.log('Using Redis cache provider (server environment)');
    } catch (error) {
      console.warn('Redis failed, falling back to Memory cache:', error);
      provider = new MemoryCache();
    }
  } else {
    provider = new MemoryCache();
    console.log('Using Memory cache provider (test mode)');
  }

  return provider;
}

// Export a function that returns a promise for the cache provider
export async function getCache(): Promise<CacheProvider> {
  return await createCacheProvider();
}

// For backward compatibility, create a synchronous cache that defaults to memory
export const cache: CacheProvider = new MemoryCache();
