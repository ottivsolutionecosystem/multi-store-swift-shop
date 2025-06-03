
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Manufacturer = Database['public']['Tables']['manufacturers']['Row'];
type ManufacturerInsert = Database['public']['Tables']['manufacturers']['Insert'];
type ManufacturerUpdate = Database['public']['Tables']['manufacturers']['Update'];

export class ManufacturerRepository {
  constructor(private storeId: string) {
    console.log('ManufacturerRepository - initialized with storeId:', storeId);
  }

  async findAll(): Promise<Manufacturer[]> {
    console.log('ManufacturerRepository - finding all manufacturers for store:', this.storeId);
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('store_id', this.storeId)
        .order('name', { ascending: true });

      if (error) {
        console.error('ManufacturerRepository - error finding all:', error);
        throw error;
      }

      console.log('ManufacturerRepository - found manufacturers:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('ManufacturerRepository - error in findAll:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Manufacturer | null> {
    console.log('ManufacturerRepository - finding manufacturer by id:', id, 'for store:', this.storeId);
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('id', id)
        .eq('store_id', this.storeId)
        .maybeSingle();

      if (error) {
        console.error('ManufacturerRepository - error finding by id:', error);
        throw error;
      }

      console.log('ManufacturerRepository - found manufacturer:', data ? 'yes' : 'no');
      return data;
    } catch (error) {
      console.error('ManufacturerRepository - error in findById:', error);
      throw error;
    }
  }

  async create(manufacturer: Omit<ManufacturerInsert, 'store_id'>): Promise<Manufacturer> {
    console.log('ManufacturerRepository - creating manufacturer:', manufacturer.name, 'for store:', this.storeId);
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .insert({ ...manufacturer, store_id: this.storeId })
        .select()
        .single();

      if (error) {
        console.error('ManufacturerRepository - error creating:', error);
        throw error;
      }

      console.log('ManufacturerRepository - manufacturer created successfully:', data.id);
      return data;
    } catch (error) {
      console.error('ManufacturerRepository - error in create:', error);
      throw error;
    }
  }

  async update(id: string, manufacturer: ManufacturerUpdate): Promise<Manufacturer> {
    console.log('ManufacturerRepository - updating manufacturer:', id, 'for store:', this.storeId);
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .update(manufacturer)
        .eq('id', id)
        .eq('store_id', this.storeId)
        .select()
        .single();

      if (error) {
        console.error('ManufacturerRepository - error updating:', error);
        throw error;
      }

      console.log('ManufacturerRepository - manufacturer updated successfully:', data.id);
      return data;
    } catch (error) {
      console.error('ManufacturerRepository - error in update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    console.log('ManufacturerRepository - deleting manufacturer:', id, 'for store:', this.storeId);
    try {
      const { error } = await supabase
        .from('manufacturers')
        .delete()
        .eq('id', id)
        .eq('store_id', this.storeId);

      if (error) {
        console.error('ManufacturerRepository - error deleting:', error);
        throw error;
      }

      console.log('ManufacturerRepository - manufacturer deleted successfully:', id);
    } catch (error) {
      console.error('ManufacturerRepository - error in delete:', error);
      throw error;
    }
  }
}
