
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { getCache } from '@/lib/cache';
import { CacheKeys } from './cache-keys';
import { MemoryCacheManager } from './memory-cache-manager';
import { CACHE_CONFIG } from './cache-config';

interface CachedUserData {
  user: User | null;
  profile: Profile | null;
  timestamp: number;
}

export class UserCacheOperations {
  static async setUser(user: User | null): Promise<void> {
    if (!user) return;
    
    try {
      const userData = {
        user,
        timestamp: Date.now()
      };
      
      const userKey = CacheKeys.getUserKey(user.id);
      const cache = await getCache();
      
      // Set in cache
      await cache.set(userKey, userData, CACHE_CONFIG.DEFAULT_TTL);
      
      // Set in memory cache
      MemoryCacheManager.set(userKey, userData);
      
      console.log('UserCacheOperations - User cached successfully');
    } catch (error) {
      console.error('UserCacheOperations - Error caching user:', error);
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userKey = CacheKeys.getUserKey(userId);
      
      // Try memory cache first
      const memoryData = MemoryCacheManager.get(userKey);
      if (memoryData) {
        console.log('UserCacheOperations - User from memory cache');
        return memoryData.user;
      }
      
      // Try cache
      const cache = await getCache();
      const cachedData = await cache.get<CachedUserData>(userKey);
      if (cachedData) {
        // Update memory cache
        MemoryCacheManager.set(userKey, cachedData);
        console.log('UserCacheOperations - User from cache');
        return cachedData.user;
      }
      
      console.log('UserCacheOperations - User cache miss');
      return null;
    } catch (error) {
      console.error('UserCacheOperations - Error getting user:', error);
      return null;
    }
  }

  static async setUserData(user: User | null, profile: Profile | null): Promise<void> {
    if (!user) return;
    
    try {
      const userData = {
        user,
        profile,
        timestamp: Date.now()
      };
      
      const userKey = CacheKeys.getUserKey(user.id);
      const cache = await getCache();
      
      // Set in cache
      await cache.set(userKey, userData, CACHE_CONFIG.DEFAULT_TTL);
      
      // Set in memory cache
      MemoryCacheManager.set(userKey, userData);
      
      console.log('UserCacheOperations - User data cached successfully');
    } catch (error) {
      console.error('UserCacheOperations - Error caching user data:', error);
    }
  }

  static async getUserData(userId: string): Promise<{ user: User | null; profile: Profile | null } | null> {
    try {
      const userKey = CacheKeys.getUserKey(userId);
      
      // Try memory cache first
      const memoryData = MemoryCacheManager.get(userKey);
      if (memoryData) {
        console.log('UserCacheOperations - User data from memory cache');
        return {
          user: memoryData.user,
          profile: memoryData.profile
        };
      }
      
      // Try cache
      const cache = await getCache();
      const cachedData = await cache.get<CachedUserData>(userKey);
      if (cachedData) {
        // Update memory cache
        MemoryCacheManager.set(userKey, cachedData);
        console.log('UserCacheOperations - User data from cache');
        return {
          user: cachedData.user,
          profile: cachedData.profile
        };
      }
      
      console.log('UserCacheOperations - User data cache miss');
      return null;
    } catch (error) {
      console.error('UserCacheOperations - Error getting user data:', error);
      return null;
    }
  }
}
