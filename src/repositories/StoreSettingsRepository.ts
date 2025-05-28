
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
type StoreSettingsInsert = Database['public']['Tables']['store_settings']['Insert'];
type StoreSettingsUpdate = Database['public']['Tables']['store_settings']['Update'];

export class StoreSettingsRepository {
  constructor(private storeId: string) {}

  async findByStoreId(): Promise<StoreSettings | null> {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('store_id', this.storeId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(settings: Omit<StoreSettingsInsert, 'store_id'>): Promise<StoreSettings> {
    const { data, error } = await supabase
      .from('store_settings')
      .insert({ ...settings, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(settings: StoreSettingsUpdate): Promise<StoreSettings> {
    const { data, error } = await supabase
      .from('store_settings')
      .update(settings)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async upsert(settings: Omit<StoreSettingsInsert, 'store_id'>): Promise<StoreSettings> {
    const { data, error } = await supabase
      .from('store_settings')
      .upsert({ ...settings, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
