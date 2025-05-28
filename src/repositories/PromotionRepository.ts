
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Promotion = Database['public']['Tables']['promotions']['Row'];
type PromotionInsert = Database['public']['Tables']['promotions']['Insert'];
type PromotionUpdate = Database['public']['Tables']['promotions']['Update'];

export class PromotionRepository {
  constructor(private storeId: string) {}

  async findAll(): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByProductId(productId: string): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('product_id', productId)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findActiveByProductId(productId: string): Promise<Promotion | null> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('product_id', productId)
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('priority', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<Promotion | null> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(promotion: Omit<PromotionInsert, 'store_id'>): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .insert({ ...promotion, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, promotion: PromotionUpdate): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .update(promotion)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)
      .eq('store_id', this.storeId);

    if (error) throw error;
  }
}
