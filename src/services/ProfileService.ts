
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
    console.log('ProfileService - START ensuring user store association for store:', storeId);
    try {
      console.log('ProfileService - step 1: getting current user profile');
      const profile = await this.getCurrentUserProfile();
      
      if (!profile) {
        console.error('ProfileService - step 1 FAILED: user profile not found for store association');
        throw new Error('User profile not found');
      }

      console.log('ProfileService - step 2: current profile data:', { 
        id: profile.id, 
        role: profile.role, 
        store_id: profile.store_id 
      });

      // Se o usuário é admin mas não tem store_id associado, associe à loja
      if (profile.role === 'admin' && !profile.store_id) {
        console.log('ProfileService - step 3: associating admin user to store:', storeId);
        await this.updateProfile({ store_id: storeId });
        console.log('ProfileService - step 3 SUCCESS: admin user successfully associated to store');
      } else if (profile.store_id && profile.store_id !== storeId) {
        console.log('ProfileService - step 3 SKIP: user already has different store_id:', {
          current: profile.store_id,
          requested: storeId
        });
      } else {
        console.log('ProfileService - step 3 SKIP: user already properly associated with store');
      }
      
      console.log('ProfileService - END: store association completed successfully');
    } catch (error) {
      console.error('ProfileService - ERROR in ensureUserStoreAssociation:', error);
      throw error;
    }
  }

  async debugUserAccess(): Promise<void> {
    console.log('ProfileService - debugging user access with new RLS policies');
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

        // Test manufacturers access with new RLS policies
        if (profile?.store_id) {
          console.log('ProfileService - testing manufacturers access for store:', profile.store_id);
          const { data: manufacturersTest, error: manufacturersError } = await supabase
            .from('manufacturers')
            .select('id, name, store_id')
            .limit(3);

          console.log('ProfileService - manufacturers access test:', { 
            data: manufacturersTest, 
            error: manufacturersError,
            count: manufacturersTest?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('ProfileService - debug error:', error);
    }
  }

  async validateStoreAccess(storeId: string): Promise<boolean> {
    console.log('ProfileService - validating store access for:', storeId);
    try {
      const profile = await this.getCurrentUserProfile();
      if (!profile) {
        console.log('ProfileService - no profile found, access denied');
        return false;
      }

      const hasAccess = profile.store_id === storeId;
      console.log('ProfileService - store access validation:', {
        userStoreId: profile.store_id,
        requestedStoreId: storeId,
        hasAccess
      });

      return hasAccess;
    } catch (error) {
      console.error('ProfileService - error validating store access:', error);
      return false;
    }
  }
}
