
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

interface CachedUserData {
  user: User | null;
  profile: Profile | null;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_KEY = 'supabase_user_cache';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export class UserCache {
  private static getCacheKey(): string {
    return CACHE_KEY;
  }

  static set(user: User | null, profile: Profile | null, ttl: number = DEFAULT_TTL): void {
    try {
      const cacheData: CachedUserData = {
        user,
        profile,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.getCacheKey(), JSON.stringify(cacheData));
      console.log('UserCache - data cached successfully');
    } catch (error) {
      console.error('UserCache - error setting cache:', error);
    }
  }

  static get(): { user: User | null; profile: Profile | null } | null {
    try {
      const cached = localStorage.getItem(this.getCacheKey());
      if (!cached) {
        console.log('UserCache - no cached data found');
        return null;
      }

      const cacheData: CachedUserData = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - cacheData.timestamp > cacheData.ttl) {
        console.log('UserCache - cache expired, removing');
        this.clear();
        return null;
      }

      console.log('UserCache - returning cached data');
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
    try {
      localStorage.removeItem(this.getCacheKey());
      console.log('UserCache - cache cleared');
    } catch (error) {
      console.error('UserCache - error clearing cache:', error);
    }
  }

  static isValid(): boolean {
    try {
      const cached = localStorage.getItem(this.getCacheKey());
      if (!cached) return false;

      const cacheData: CachedUserData = JSON.parse(cached);
      const now = Date.now();
      
      return (now - cacheData.timestamp) <= cacheData.ttl;
    } catch (error) {
      console.error('UserCache - error checking cache validity:', error);
      return false;
    }
  }

  static updateProfile(profile: Profile | null): void {
    try {
      const cached = this.get();
      if (cached) {
        this.set(cached.user, profile);
        console.log('UserCache - profile updated in cache');
      }
    } catch (error) {
      console.error('UserCache - error updating profile in cache:', error);
    }
  }
}
