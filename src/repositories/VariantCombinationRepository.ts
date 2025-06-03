
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ProductVariantCombination = Database['public']['Tables']['product_variant_combinations']['Row'];
type ProductVariantCombinationInsert = Database['public']['Tables']['product_variant_combinations']['Insert'];
type ProductVariantCombinationUpdate = Database['public']['Tables']['product_variant_combinations']['Update'];

export interface CombinationWithValues extends ProductVariantCombination {
  values: Array<{
    id: string;
    variant_name: string;
    value: string;
  }>;
}

export class VariantCombinationRepository {
  constructor(private storeId: string) {}

  async getCombinationsByProduct(productId: string): Promise<CombinationWithValues[]> {
    const { data, error } = await supabase
      .from('product_variant_combinations')
      .select(`
        *,
        combination_values:product_variant_combination_values (
          variant_value:product_variant_values (
            id,
            value,
            variant:product_variants (
              id,
              name
            )
          )
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(combination => ({
      ...combination,
      values: combination.combination_values.map((cv: any) => ({
        id: cv.variant_value.id,
        variant_name: cv.variant_value.variant.name,
        value: cv.variant_value.value
      }))
    }));
  }

  async createCombination(
    combination: Omit<ProductVariantCombinationInsert, 'id'>,
    variantValueIds: string[]
  ): Promise<ProductVariantCombination> {
    const { data: combinationData, error: combinationError } = await supabase
      .from('product_variant_combinations')
      .insert(combination)
      .select()
      .single();

    if (combinationError) throw combinationError;

    // Create combination values relationships
    const combinationValues = variantValueIds.map(valueId => ({
      combination_id: combinationData.id,
      variant_value_id: valueId
    }));

    const { error: valuesError } = await supabase
      .from('product_variant_combination_values')
      .insert(combinationValues);

    if (valuesError) throw valuesError;

    return combinationData;
  }

  async updateCombination(id: string, combination: ProductVariantCombinationUpdate): Promise<ProductVariantCombination> {
    const { data, error } = await supabase
      .from('product_variant_combinations')
      .update(combination)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCombination(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_variant_combinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
