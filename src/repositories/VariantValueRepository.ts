
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ProductVariantValue = Database['public']['Tables']['product_variant_values']['Row'];
type ProductVariantValueInsert = Database['public']['Tables']['product_variant_values']['Insert'];

export class VariantValueRepository {
  constructor(private storeId: string) {}

  async createVariantValue(value: Omit<ProductVariantValueInsert, 'id'>): Promise<ProductVariantValue> {
    const { data, error } = await supabase
      .from('product_variant_values')
      .insert(value)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVariantValue(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_variant_values')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
