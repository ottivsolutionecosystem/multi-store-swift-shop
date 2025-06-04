
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
      .eq('status', 'active')
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByProductIds(productIds: string[]): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .or(`product_ids.cs.["${productIds.join('","')}"],promotion_type.eq.global`)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findActiveByProductId(productId: string): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('status', 'active')
      .or(`product_ids.cs.["${productId}"],promotion_type.eq.global`)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCategoryIds(categoryIds: string[]): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .or(`category_ids.cs.["${categoryIds.join('","')}"],promotion_type.eq.global`)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findActiveByCategoryId(categoryId: string): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('status', 'active')
      .or(`category_ids.cs.["${categoryId}"],promotion_type.eq.global`)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
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

  async updateStatusByDate(): Promise<void> {
    const now = new Date().toISOString();
    
    // Ativar promoções agendadas que chegaram na data de início
    await supabase
      .from('promotions')
      .update({ status: 'active' })
      .eq('store_id', this.storeId)
      .eq('status', 'scheduled')
      .lte('start_date', now);

    // Expirar promoções ativas que passaram da data de fim
    await supabase
      .from('promotions')
      .update({ status: 'expired' })
      .eq('store_id', this.storeId)
      .eq('status', 'active')
      .lt('end_date', now);
  }
}
