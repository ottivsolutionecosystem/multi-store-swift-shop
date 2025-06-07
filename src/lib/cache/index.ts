
import { CacheProvider } from './cache-provider';
import { RedisCache } from './redis-cache';
import { MemoryCache } from './memory-cache';

let provider: CacheProvider | null = null;

function createCacheProvider(): CacheProvider {
  if (provider) return provider;

  // Use Redis in production, Memory cache for tests or fallback
  if (typeof window === 'undefined' || import.meta.env.MODE === 'test') {
    provider = new MemoryCache();
    console.log('Using Memory cache provider');
  } else {
    try {
      provider = new RedisCache();
      console.log('Using Redis cache provider');
    } catch (error) {
      console.warn('Redis failed, falling back to Memory cache:', error);
      provider = new MemoryCache();
    }
  }

  return provider;
}

export const cache = createCacheProvider();
