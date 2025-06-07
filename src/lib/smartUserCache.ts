
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { cache } from '@/lib/cache';

interface CachedUserData {
  user: User | null;
  profile: Profile | null;
  timestamp: number;
}

export class SmartUserCache {
  private static readonly USER_KEY_PREFIX = 'user:';
  private static readonly PROFILE_KEY_PREFIX = 'profile:';
  private static readonly SESSION_KEY_PREFIX = 'session:';
  
  // TTL configurations
  private static readonly DEFAULT_TTL = 900; // 15 minutes
  private static readonly PROFILE_TTL = 1800; // 30 minutes
  private static readonly SESSION_TTL = 3600; // 1 hour

  // Memory cache for ultra-fast access (1 minute TTL)
  private static memoryCache = new Map<string, { data: any; expiresAt: number }>();
  private static readonly MEMORY_TTL = 60 * 1000; // 1 minute in milliseconds

  private static getUserKey(userId: string): string {
    return `${this.USER_KEY_PREFIX}${userId}`;
  }

  private static getProfileKey(userId: string): string {
    return `${this.PROFILE_KEY_PREFIX}${userId}`;
  }

  private static getSessionKey(sessionId: string): string {
    return `${this.SESSION_KEY_PREFIX}${sessionId}`;
  }

  // Memory cache helpers
  private static setMemoryCache(key: string, data: any): void {
    this.memoryCache.set(key, {
      data,
      expiresAt: Date.now() + this.MEMORY_TTL
    });
  }

  private static getMemoryCache(key: string): any | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    
    if (item.expiresAt < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static async setUser(user: User | null): Promise<void> {
    if (!user) return;
    
    try {
      const userData = {
        user,
        timestamp: Date.now()
      };
      
      const userKey = this.getUserKey(user.id);
      
      // Set in Redis
      await cache.set(userKey, userData, this.DEFAULT_TTL);
      
      // Set in memory cache
      this.setMemoryCache(userKey, userData);
      
      console.log('SmartUserCache - User cached successfully');
    } catch (error) {
      console.error('SmartUserCache - Error caching user:', error);
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userKey = this.getUserKey(userId);
      
      // Try memory cache first
      const memoryData = this.getMemoryCache(userKey);
      if (memoryData) {
        console.log('SmartUserCache - User from memory cache');
        return memoryData.user;
      }
      
      // Try Redis cache
      const cachedData = await cache.get<CachedUserData>(userKey);
      if (cachedData) {
        // Update memory cache
        this.setMemoryCache(userKey, cachedData);
        console.log('SmartUserCache - User from Redis cache');
        return cachedData.user;
      }
      
      console.log('SmartUserCache - User cache miss');
      return null;
    } catch (error) {
      console.error('SmartUserCache - Error getting user:', error);
      return null;
    }
  }

  static async setProfile(userId: string, profile: Profile | null): Promise<void> {
    if (!profile) return;
    
    try {
      const profileData = {
        profile,
        timestamp: Date.now()
      };
      
      const profileKey = this.getProfileKey(userId);
      
      // Set in Redis
      await cache.set(profileKey, profileData, this.PROFILE_TTL);
      
      // Set in memory cache
      this.setMemoryCache(profileKey, profileData);
      
      console.log('SmartUserCache - Profile cached successfully');
    } catch (error) {
      console.error('SmartUserCache - Error caching profile:', error);
    }
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const profileKey = this.getProfileKey(userId);
      
      // Try memory cache first
      const memoryData = this.getMemoryCache(profileKey);
      if (memoryData) {
        console.log('SmartUserCache - Profile from memory cache');
        return memoryData.profile;
      }
      
      // Try Redis cache
      const cachedData = await cache.get<CachedUserData>(profileKey);
      if (cachedData) {
        // Update memory cache
        this.setMemoryCache(profileKey, cachedData);
        console.log('SmartUserCache - Profile from Redis cache');
        return cachedData.profile;
      }
      
      console.log('SmartUserCache - Profile cache miss');
      return null;
    } catch (error) {
      console.error('SmartUserCache - Error getting profile:', error);
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
      
      const userKey = this.getUserKey(user.id);
      
      // Set in Redis
      await cache.set(userKey, userData, this.DEFAULT_TTL);
      
      // Set in memory cache
      this.setMemoryCache(userKey, userData);
      
      // Also cache profile separately
      if (profile) {
        await this.setProfile(user.id, profile);
      }
      
      console.log('SmartUserCache - User data cached successfully');
    } catch (error) {
      console.error('SmartUserCache - Error caching user data:', error);
    }
  }

  static async getUserData(userId: string): Promise<{ user: User | null; profile: Profile | null } | null> {
    try {
      const userKey = this.getUserKey(userId);
      
      // Try memory cache first
      const memoryData = this.getMemoryCache(userKey);
      if (memoryData) {
        console.log('SmartUserCache - User data from memory cache');
        return {
          user: memoryData.user,
          profile: memoryData.profile
        };
      }
      
      // Try Redis cache
      const cachedData = await cache.get<CachedUserData>(userKey);
      if (cachedData) {
        // Update memory cache
        this.setMemoryCache(userKey, cachedData);
        console.log('SmartUserCache - User data from Redis cache');
        return {
          user: cachedData.user,
          profile: cachedData.profile
        };
      }
      
      console.log('SmartUserCache - User data cache miss');
      return null;
    } catch (error) {
      console.error('SmartUserCache - Error getting user data:', error);
      return null;
    }
  }

  static async invalidateUser(userId: string): Promise<void> {
    try {
      const userKey = this.getUserKey(userId);
      const profileKey = this.getProfileKey(userId);
      
      // Clear from Redis
      await Promise.all([
        cache.del(userKey),
        cache.del(profileKey)
      ]);
      
      // Clear from memory cache
      this.memoryCache.delete(userKey);
      this.memoryCache.delete(profileKey);
      
      console.log('SmartUserCache - User cache invalidated');
    } catch (error) {
      console.error('SmartUserCache - Error invalidating user cache:', error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear();
      
      // Clear Redis cache (this clears all cache, use with caution)
      await cache.clear();
      
      console.log('SmartUserCache - All cache cleared');
    } catch (error) {
      console.error('SmartUserCache - Error clearing cache:', error);
    }
  }

  static getCacheStats(): { memoryKeys: number; redisConnected: boolean } {
    return {
      memoryKeys: this.memoryCache.size,
      redisConnected: true // TODO: implement Redis connection check
    };
  }
}
