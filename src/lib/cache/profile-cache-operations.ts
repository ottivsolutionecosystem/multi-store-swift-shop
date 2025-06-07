
import { Profile } from '@/types/auth';
import { getCache } from '@/lib/cache';
import { CacheKeys } from './cache-keys';
import { MemoryCacheManager } from './memory-cache-manager';
import { CACHE_CONFIG } from './cache-config';

interface CachedProfileData {
  profile: Profile | null;
  timestamp: number;
}

export class ProfileCacheOperations {
  static async setProfile(userId: string, profile: Profile | null): Promise<void> {
    if (!profile) return;
    
    try {
      const profileData = {
        profile,
        timestamp: Date.now()
      };
      
      const profileKey = CacheKeys.getProfileKey(userId);
      const cache = await getCache();
      
      // Set in cache
      await cache.set(profileKey, profileData, CACHE_CONFIG.PROFILE_TTL);
      
      // Set in memory cache
      MemoryCacheManager.set(profileKey, profileData);
      
      console.log('ProfileCacheOperations - Profile cached successfully');
    } catch (error) {
      console.error('ProfileCacheOperations - Error caching profile:', error);
    }
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const profileKey = CacheKeys.getProfileKey(userId);
      
      // Try memory cache first
      const memoryData = MemoryCacheManager.get(profileKey);
      if (memoryData) {
        console.log('ProfileCacheOperations - Profile from memory cache');
        return memoryData.profile;
      }
      
      // Try cache
      const cache = await getCache();
      const cachedData = await cache.get<CachedProfileData>(profileKey);
      if (cachedData) {
        // Update memory cache
        MemoryCacheManager.set(profileKey, cachedData);
        console.log('ProfileCacheOperations - Profile from cache');
        return cachedData.profile;
      }
      
      console.log('ProfileCacheOperations - Profile cache miss');
      return null;
    } catch (error) {
      console.error('ProfileCacheOperations - Error getting profile:', error);
      return null;
    }
  }
}
