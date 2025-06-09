
import { supabase } from '@/integrations/supabase/client';
import { ShippingMethod } from '@/types/shipping';

export class ShippingMethodRepository {
  constructor(private storeId: string) {}

  async findAll(): Promise<ShippingMethod[]> {
    console.log('ShippingMethodRepository - getting all shipping methods for store:', this.storeId);
    
    const { data, error } = await supabase
      .from('shipping_methods')
      .select('*')
      .eq('store_id', this.storeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('ShippingMethodRepository - error getting shipping methods:', error);
      throw error;
    }

    console.log('ShippingMethodRepository - found shipping methods:', data?.length || 0);
    return (data || []).map(this.mapToShippingMethod);
  }

  async findActive(): Promise<ShippingMethod[]> {
    console.log('ShippingMethodRepository - getting active shipping methods for store:', this.storeId);
    
    const { data, error } = await supabase
      .from('shipping_methods')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('ShippingMethodRepository - error getting active shipping methods:', error);
      throw error;
    }

    console.log('ShippingMethodRepository - found active shipping methods:', data?.length || 0);
    return (data || []).map(this.mapToShippingMethod);
  }

  async findById(id: string): Promise<ShippingMethod | null> {
    console.log('ShippingMethodRepository - getting shipping method by id:', id);
    
    const { data, error } = await supabase
      .from('shipping_methods')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .single();

    if (error) {
      console.error('ShippingMethodRepository - error getting shipping method:', error);
      throw error;
    }

    console.log('ShippingMethodRepository - found shipping method:', data);
    return data ? this.mapToShippingMethod(data) : null;
  }

  async create(shippingMethod: Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>): Promise<ShippingMethod> {
    console.log('ShippingMethodRepository - creating shipping method:', shippingMethod);
    
    const { data, error } = await supabase
      .from('shipping_methods')
      .insert({
        ...shippingMethod,
        store_id: this.storeId,
      })
      .select()
      .single();

    if (error) {
      console.error('ShippingMethodRepository - error creating shipping method:', error);
      throw error;
    }

    console.log('ShippingMethodRepository - created shipping method:', data);
    return this.mapToShippingMethod(data);
  }

  async update(id: string, updates: Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>): Promise<ShippingMethod> {
    console.log('ShippingMethodRepository - updating shipping method:', id, updates);
    
    const { data, error } = await supabase
      .from('shipping_methods')
      .update(updates)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) {
      console.error('ShippingMethodRepository - error updating shipping method:', error);
      throw error;
    }

    console.log('ShippingMethodRepository - updated shipping method:', data);
    return this.mapToShippingMethod(data);
  }

  async delete(id: string): Promise<void> {
    console.log('ShippingMethodRepository - deleting shipping method:', id);
    
    const { error } = await supabase
      .from('shipping_methods')
      .delete()
      .eq('id', id)
      .eq('store_id', this.storeId);

    if (error) {
      console.error('ShippingMethodRepository - error deleting shipping method:', error);
      throw error;
    }

    console.log('ShippingMethodRepository - deleted shipping method:', id);
  }

  // Alias methods for backward compatibility
  async getAllShippingMethods(): Promise<ShippingMethod[]> {
    return this.findAll();
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    return this.findActive();
  }

  async getShippingMethodById(id: string): Promise<ShippingMethod | null> {
    return this.findById(id);
  }

  async createShippingMethod(shippingMethod: Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>): Promise<ShippingMethod> {
    return this.create(shippingMethod);
  }

  async updateShippingMethod(id: string, updates: Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>): Promise<ShippingMethod> {
    return this.update(id, updates);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    return this.delete(id);
  }

  private mapToShippingMethod(data: any): ShippingMethod {
    return {
      id: data.id,
      store_id: data.store_id,
      name: data.name,
      type: data.type,
      is_active: data.is_active,
      price: data.price,
      delivery_days: data.delivery_days,
      delivery_label_type: data.delivery_label_type,
      api_url: data.api_url,
      api_headers: (data.api_headers as Record<string, string>) || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}
