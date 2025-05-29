
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  async getCurrentUserProfile(): Promise<Profile | null> {
    console.log('ProfileService - getting current user profile');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('ProfileService - no authenticated user');
        return null;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('ProfileService - error getting profile:', error);
        throw error;
      }

      console.log('ProfileService - profile loaded:', profile);
      return profile;
    } catch (error) {
      console.error('ProfileService - error in getCurrentUserProfile:', error);
      throw error;
    }
  }

  async updateProfile(updates: ProfileUpdate): Promise<Profile> {
    console.log('ProfileService - updating profile with:', updates);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('ProfileService - user not authenticated for update');
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('ProfileService - error updating profile:', error);
        throw error;
      }

      console.log('ProfileService - profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('ProfileService - error in updateProfile:', error);
      throw error;
    }
  }

  async ensureUserStoreAssociation(storeId: string): Promise<void> {
    console.log('ProfileService - ensuring user store association for store:', storeId);
    try {
      const profile = await this.getCurrentUserProfile();
      if (!profile) {
        console.error('ProfileService - user profile not found for store association');
        throw new Error('User profile not found');
      }

      console.log('ProfileService - current profile:', { 
        id: profile.id, 
        role: profile.role, 
        store_id: profile.store_id 
      });

      // Se o usuário é admin mas não tem store_id associado, associe à loja
      if (profile.role === 'admin' && !profile.store_id) {
        console.log('ProfileService - associating admin user to store:', storeId);
        await this.updateProfile({ store_id: storeId });
        console.log('ProfileService - admin user successfully associated to store');
      } else if (profile.store_id && profile.store_id !== storeId) {
        console.log('ProfileService - user already has different store_id:', {
          current: profile.store_id,
          requested: storeId
        });
      } else {
        console.log('ProfileService - user already properly associated with store');
      }
    } catch (error) {
      console.error('ProfileService - error ensuring store association:', error);
      throw error;
    }
  }

  async debugUserAccess(): Promise<void> {
    console.log('ProfileService - debugging user access');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('ProfileService - authenticated user:', user?.id);

      if (user) {
        const profile = await this.getCurrentUserProfile();
        console.log('ProfileService - user profile debug:', {
          id: profile?.id,
          email: profile?.email,
          role: profile?.role,
          store_id: profile?.store_id
        });

        // Test if user can access profiles table
        const { data: testQuery, error: testError } = await supabase
          .from('profiles')
          .select('id, role, store_id')
          .eq('id', user.id)
          .limit(1);

        console.log('ProfileService - profile access test:', { data: testQuery, error: testError });
      }
    } catch (error) {
      console.error('ProfileService - debug error:', error);
    }
  }
}
