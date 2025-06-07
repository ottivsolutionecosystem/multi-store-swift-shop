
import { getCache } from '@/lib/cache';
import { CacheKeys } from './cache-keys';
import { MemoryCacheManager } from './memory-cache-manager';

export class CacheManagement {
  static async invalidateUser(userId: string): Promise<void> {
    try {
      const userKey = CacheKeys.getUserKey(userId);
      const profileKey = CacheKeys.getProfileKey(userId);
      const cache = await getCache();
      
      // Clear from cache
      await Promise.all([
        cache.del(userKey),
        cache.del(profileKey)
      ]);
      
      // Clear from memory cache
      MemoryCacheManager.delete(userKey);
      MemoryCacheManager.delete(profileKey);
      
      console.log('CacheManagement - User cache invalidated');
    } catch (error) {
      console.error('CacheManagement - Error invalidating user cache:', error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      // Clear memory cache
      MemoryCacheManager.clear();
      
      // Clear cache
      const cache = await getCache();
      await cache.clear();
      
      console.log('CacheManagement - All cache cleared');
    } catch (error) {
      console.error('CacheManagement - Error clearing cache:', error);
    }
  }

  static getCacheStats(): { memoryKeys: number; redisConnected: boolean } {
    return {
      memoryKeys: MemoryCacheManager.getSize(),
      redisConnected: true // TODO: implement connection check
    };
  }
}
