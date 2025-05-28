
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
    const profile = await this.getCurrentUserProfile();
    if (!profile) throw new Error('User profile not found');

    // Se o usuário é admin mas não tem store_id associado, associe à loja
    if (profile.role === 'admin' && !profile.store_id) {
      console.log('Associating admin user to store:', storeId);
      await this.updateProfile({ store_id: storeId });
    }
  }
}
