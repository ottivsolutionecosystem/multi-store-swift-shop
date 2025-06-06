
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class UserRepository {
  private storeId: string;

  constructor(storeId: string) {
    this.storeId = storeId;
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('UserRepository - getting current user');
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('UserRepository - error getting user:', error);
        throw error;
      }
      return user;
    } catch (error) {
      console.error('UserRepository - error in getCurrentUser:', error);
      throw error;
    }
  }

  async getCurrentUserProfile(): Promise<Profile | null> {
    console.log('UserRepository - getting current user profile');
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.log('UserRepository - no authenticated user');
        return null;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('UserRepository - error getting profile:', error);
        throw error;
      }

      console.log('UserRepository - profile loaded:', profile);
      return profile;
    } catch (error) {
      console.error('UserRepository - error in getCurrentUserProfile:', error);
      throw error;
    }
  }

  async updateProfile(updates: ProfileUpdate): Promise<Profile> {
    console.log('UserRepository - updating profile with:', updates);
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.error('UserRepository - user not authenticated for update');
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('UserRepository - error updating profile:', error);
        throw error;
      }

      console.log('UserRepository - profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('UserRepository - error in updateProfile:', error);
      throw error;
    }
  }

  async ensureUserStoreAssociation(storeId: string): Promise<void> {
    console.log('UserRepository - ensuring user store association for store:', storeId);
    try {
      const profile = await this.getCurrentUserProfile();
      if (!profile) {
        console.error('UserRepository - user profile not found for store association');
        throw new Error('User profile not found');
      }

      console.log('UserRepository - current profile:', { 
        id: profile.id, 
        role: profile.role, 
        store_id: profile.store_id 
      });

      if (profile.role === 'admin' && !profile.store_id) {
        console.log('UserRepository - associating admin user to store:', storeId);
        await this.updateProfile({ store_id: storeId });
        console.log('UserRepository - admin user successfully associated to store');
      }
    } catch (error) {
      console.error('UserRepository - error ensuring store association:', error);
      throw error;
    }
  }

  async validateStoreAccess(storeId: string): Promise<boolean> {
    console.log('UserRepository - validating store access for:', storeId);
    try {
      const profile = await this.getCurrentUserProfile();
      if (!profile) {
        console.log('UserRepository - no profile found, access denied');
        return false;
      }

      const hasAccess = profile.store_id === storeId;
      console.log('UserRepository - store access validation:', {
        userStoreId: profile.store_id,
        requestedStoreId: storeId,
        hasAccess
      });

      return hasAccess;
    } catch (error) {
      console.error('UserRepository - error validating store access:', error);
      return false;
    }
  }

  async signIn(email: string, password: string) {
    console.log('UserRepository - signing in user');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('UserRepository - sign in error:', error);
      throw error;
    }
    console.log('UserRepository - user signed in successfully');
    return data;
  }

  async signUp(email: string, password: string, fullName?: string) {
    console.log('UserRepository - signing up user');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('UserRepository - sign up error:', error);
      throw error;
    }
    console.log('UserRepository - user signed up successfully');
    return data;
  }

  async signOut() {
    console.log('UserRepository - signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('UserRepository - sign out error:', error);
      throw error;
    }
    console.log('UserRepository - user signed out successfully');
  }
}
