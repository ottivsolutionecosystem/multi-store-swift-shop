
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { UserCacheOperations } from './cache/user-cache-operations';
import { ProfileCacheOperations } from './cache/profile-cache-operations';
import { CacheManagement } from './cache/cache-management';

export class SmartUserCache {
  // User operations
  static async setUser(user: User | null): Promise<void> {
    return UserCacheOperations.setUser(user);
  }

  static async getUser(userId: string): Promise<User | null> {
    return UserCacheOperations.getUser(userId);
  }

  static async setUserData(user: User | null, profile: Profile | null): Promise<void> {
    await UserCacheOperations.setUserData(user, profile);
    // Also cache profile separately
    if (user && profile) {
      await ProfileCacheOperations.setProfile(user.id, profile);
    }
  }

  static async getUserData(userId: string): Promise<{ user: User | null; profile: Profile | null } | null> {
    return UserCacheOperations.getUserData(userId);
  }

  // Profile operations
  static async setProfile(userId: string, profile: Profile | null): Promise<void> {
    return ProfileCacheOperations.setProfile(userId, profile);
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    return ProfileCacheOperations.getProfile(userId);
  }

  // Cache management
  static async invalidateUser(userId: string): Promise<void> {
    return CacheManagement.invalidateUser(userId);
  }

  static async clearAll(): Promise<void> {
    return CacheManagement.clearAll();
  }

  static getCacheStats(): { memoryKeys: number; redisConnected: boolean } {
    return CacheManagement.getCacheStats();
  }
}
