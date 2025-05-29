
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  async getCurrentUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return profile;
  }

  async updateProfile(updates: ProfileUpdate): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async ensureUserStoreAssociation(storeId: string): Promise<void> {
    console.log('ProfileService.ensureUserStoreAssociation - storeId:', storeId);
    
    const profile = await this.getCurrentUserProfile();
    if (!profile) {
      console.error('ProfileService.ensureUserStoreAssociation - User profile not found');
      throw new Error('User profile not found');
    }

    console.log('ProfileService.ensureUserStoreAssociation - current profile:', profile);

    // Se o usuário é admin mas não tem store_id associado, associe à loja
    if (profile.role === 'admin' && !profile.store_id) {
      console.log('ProfileService.ensureUserStoreAssociation - Associating admin user to store:', storeId);
      await this.updateProfile({ store_id: storeId });
      console.log('ProfileService.ensureUserStoreAssociation - Association completed');
    } else if (profile.store_id && profile.store_id !== storeId) {
      console.warn('ProfileService.ensureUserStoreAssociation - User store_id mismatch:', {
        userStoreId: profile.store_id,
        requestedStoreId: storeId
      });
    } else {
      console.log('ProfileService.ensureUserStoreAssociation - User already properly associated');
    }
  }

  async debugUserAccess(): Promise<void> {
    console.log('=== DEBUG USER ACCESS ===');
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.id);
    
    if (user) {
      const profile = await this.getCurrentUserProfile();
      console.log('User profile:', profile);
      
      // Test RLS functions
      try {
        const { data: isAdmin } = await supabase.rpc('is_user_admin');
        console.log('Is user admin (RPC):', isAdmin);
      } catch (error) {
        console.error('Error checking is_user_admin:', error);
      }
      
      try {
        const { data: userStoreId } = await supabase.rpc('get_user_store_id');
        console.log('User store ID (RPC):', userStoreId);
      } catch (error) {
        console.error('Error getting user_store_id:', error);
      }
    }
    
    console.log('=== END DEBUG ===');
  }
}
