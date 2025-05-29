
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  private async waitForAuth(maxRetries = 3): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        console.log('ProfileService - auth verified, user:', user.id);
        return user;
      }
      console.log(`ProfileService - auth attempt ${i + 1}/${maxRetries} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    throw new Error('Authentication verification failed after retries');
  }

  async getCurrentUserProfile(): Promise<Profile | null> {
    console.log('ProfileService - getting current user profile');
    try {
      const user = await this.waitForAuth();
      if (!user) {
        console.log('ProfileService - no authenticated user');
        return null;
      }

      console.log('ProfileService - querying profile for user:', user.id);
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
      const user = await this.waitForAuth();
      if (!user) {
        console.error('ProfileService - user not authenticated for update');
        throw new Error('User not authenticated');
      }

      console.log('ProfileService - updating profile for user:', user.id);
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
        
        // Try to create profile if it doesn't exist
        const user = await this.waitForAuth();
        if (user) {
          console.log('ProfileService - creating missing profile for user:', user.id);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email || '',
              role: 'admin',
              store_id: storeId
            }])
            .select()
            .single();

          if (createError) {
            console.error('ProfileService - error creating profile:', createError);
            throw createError;
          }
          
          console.log('ProfileService - profile created:', newProfile);
          return;
        }
        
        throw new Error('User profile not found and could not be created');
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
      const user = await this.waitForAuth();
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
