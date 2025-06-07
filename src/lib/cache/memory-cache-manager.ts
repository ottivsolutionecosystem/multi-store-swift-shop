
import { CACHE_CONFIG } from './cache-config';

interface MemoryCacheItem {
  data: any;
  expiresAt: number;
}

export class MemoryCacheManager {
  private static cache = new Map<string, MemoryCacheItem>();

  static set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + CACHE_CONFIG.MEMORY_TTL
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static getSize(): number {
    return this.cache.size;
  }
}
