
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Manufacturer = Database['public']['Tables']['manufacturers']['Row'];
type ManufacturerInsert = Database['public']['Tables']['manufacturers']['Insert'];
type ManufacturerUpdate = Database['public']['Tables']['manufacturers']['Update'];

export class ManufacturerRepository {
  constructor(private storeId: string) {}

  async findAll(): Promise<Manufacturer[]> {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('store_id', this.storeId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<Manufacturer | null> {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(manufacturer: Omit<ManufacturerInsert, 'store_id'>): Promise<Manufacturer> {
    const { data, error } = await supabase
      .from('manufacturers')
      .insert({ ...manufacturer, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, manufacturer: ManufacturerUpdate): Promise<Manufacturer> {
    const { data, error } = await supabase
      .from('manufacturers')
      .update(manufacturer)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('manufacturers')
      .delete()
      .eq('id', id)
      .eq('store_id', this.storeId);

    if (error) throw error;
  }
}
