
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { SmartUserCache } from '@/lib/smartUserCache';
import { UserSessionService } from './UserSessionService';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class UserProfileManagementService {
  private userSessionService: UserSessionService;

  constructor() {
    this.userSessionService = new UserSessionService();
  }

  async getCurrentUserProfile(): Promise<Profile | null> {
    console.log('UserProfileManagementService - getting current user profile with smart cache');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        console.log('UserProfileManagementService - no authenticated user for profile');
        return null;
      }

      // Try to get from cache first
      const cachedProfile = await SmartUserCache.getProfile(user.id);
      if (cachedProfile) {
        console.log('UserProfileManagementService - returning cached profile');
        return cachedProfile;
      }

      // If not in cache, fetch from database
      console.log('UserProfileManagementService - fetching profile from database');
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('UserProfileManagementService - error getting profile:', error);
        throw error;
      }

      // Cache the profile
      if (profile) {
        await SmartUserCache.setProfile(user.id, profile);
      }

      console.log('UserProfileManagementService - profile fetched and cached');
      return profile;
    } catch (error) {
      console.error('UserProfileManagementService - error in getCurrentUserProfile:', error);
      throw error;
    }
  }

  async updateProfile(updates: ProfileUpdate): Promise<Profile> {
    console.log('UserProfileManagementService - updating profile and invalidating cache');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        console.error('UserProfileManagementService - user not authenticated for update');
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('UserProfileManagementService - error updating profile:', error);
        throw error;
      }

      // Invalidate cache and set updated profile
      await SmartUserCache.invalidateUser(user.id);
      await SmartUserCache.setProfile(user.id, data);

      console.log('UserProfileManagementService - profile updated and cache refreshed');
      return data;
    } catch (error) {
      console.error('UserProfileManagementService - error in updateProfile:', error);
      throw error;
    }
  }
}
