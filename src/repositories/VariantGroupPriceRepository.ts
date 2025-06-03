
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ProductVariantGroupPrice = Database['public']['Tables']['product_variant_group_prices']['Row'];
type ProductVariantGroupPriceInsert = Database['public']['Tables']['product_variant_group_prices']['Insert'];

export interface GroupPriceWithValue extends ProductVariantGroupPrice {
  variant_value: {
    id: string;
    value: string;
    variant: {
      id: string;
      name: string;
    };
  };
}

export class VariantGroupPriceRepository {
  constructor(private storeId: string) {}

  async getGroupPricesByProduct(productId: string): Promise<GroupPriceWithValue[]> {
    const { data, error } = await supabase
      .from('product_variant_group_prices')
      .select(`
        *,
        variant_value:product_variant_values (
          id,
          value,
          variant:product_variants (
            id,
            name
          )
        )
      `)
      .eq('product_id', productId);

    if (error) throw error;
    return data as GroupPriceWithValue[];
  }

  async upsertGroupPrice(groupPrice: ProductVariantGroupPriceInsert): Promise<ProductVariantGroupPrice> {
    const { data, error } = await supabase
      .from('product_variant_group_prices')
      .upsert(groupPrice, {
        onConflict: 'product_id,variant_value_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteGroupPrice(productId: string, variantValueId: string): Promise<void> {
    const { error } = await supabase
      .from('product_variant_group_prices')
      .delete()
      .eq('product_id', productId)
      .eq('variant_value_id', variantValueId);

    if (error) throw error;
  }
}
