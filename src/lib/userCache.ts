// DEPRECATED: This file is being replaced by smartUserCache.ts
// Please use SmartUserCache instead for better performance and Redis integration

import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { SmartUserCache } from './smartUserCache';

interface CachedUserData {
  user: User | null;
  profile: Profile | null;
  timestamp: number;
  ttl: number;
}

const CACHE_KEY = 'supabase_user_cache';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * @deprecated Use SmartUserCache instead for better performance and Redis integration
 */
export class UserCache {
  private static getCacheKey(): string {
    return CACHE_KEY;
  }

  static set(user: User | null, profile: Profile | null, ttl: number = DEFAULT_TTL): void {
    console.warn('UserCache.set is deprecated. Use SmartUserCache.setUserData instead');
    try {
      if (user) {
        SmartUserCache.setUserData(user, profile);
      }
      
      // Keep legacy localStorage behavior for compatibility
      const cacheData: CachedUserData = {
        user,
        profile,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.getCacheKey(), JSON.stringify(cacheData));
    } catch (error) {
      console.error('UserCache - error setting cache:', error);
    }
  }

  static get(): { user: User | null; profile: Profile | null } | null {
    console.warn('UserCache.get is deprecated. Use SmartUserCache.getUserData instead');
    try {
      const cached = localStorage.getItem(this.getCacheKey());
      if (!cached) {
        return null;
      }

      const cacheData: CachedUserData = JSON.parse(cached);
      const now = Date.now();
      
      if (now - cacheData.timestamp > cacheData.ttl) {
        this.clear();
        return null;
      }

      return {
        user: cacheData.user,
        profile: cacheData.profile,
      };
    } catch (error) {
      console.error('UserCache - error getting cache:', error);
      this.clear();
      return null;
    }
  }

  static clear(): void {
    console.warn('UserCache.clear is deprecated. Use SmartUserCache.clearAll instead');
    try {
      localStorage.removeItem(this.getCacheKey());
      SmartUserCache.clearAll();
    } catch (error) {
      console.error('UserCache - error clearing cache:', error);
    }
  }

  static isValid(): boolean {
    console.warn('UserCache.isValid is deprecated');
    try {
      const cached = localStorage.getItem(this.getCacheKey());
      if (!cached) return false;

      const cacheData: CachedUserData = JSON.parse(cached);
      const now = Date.now();
      
      return (now - cacheData.timestamp) <= cacheData.ttl;
    } catch (error) {
      return false;
    }
  }

  static updateProfile(profile: Profile | null): void {
    console.warn('UserCache.updateProfile is deprecated. Use SmartUserCache.setProfile instead');
    try {
      const cached = this.get();
      if (cached?.user && profile) {
        SmartUserCache.setProfile(cached.user.id, profile);
        this.set(cached.user, profile);
      }
    } catch (error) {
      console.error('UserCache - error updating profile in cache:', error);
    }
  }
}
