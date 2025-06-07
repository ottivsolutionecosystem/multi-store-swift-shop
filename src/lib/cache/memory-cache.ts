
import { CacheProvider } from './cache-provider';

interface CacheItem<T> {
  value: T;
  expiresAt?: number;
}

export class MemoryCache implements CacheProvider {
  private store = new Map<string, CacheItem<any>>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) {
      console.log(`Memory cache MISS for key: ${key}`);
      return null;
    }

    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.store.delete(key);
      console.log(`Memory cache EXPIRED for key: ${key}`);
      return null;
    }

    console.log(`Memory cache HIT for key: ${key}`);
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 900): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
    console.log(`Memory cache SET for key: ${key}, TTL: ${ttlSeconds}s`);
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
    console.log(`Memory cache DEL for key: ${key}`);
  }

  async clear(): Promise<void> {
    this.store.clear();
    console.log('Memory cache cleared');
  }
}
