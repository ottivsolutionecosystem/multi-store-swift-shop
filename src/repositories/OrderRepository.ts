
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export class OrderRepository {
  constructor(private storeId: string) {}

  async findAllByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', this.storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(order: Omit<OrderInsert, 'store_id'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...order, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, order: OrderUpdate): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
