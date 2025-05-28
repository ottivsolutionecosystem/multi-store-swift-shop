
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert'];
type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update'];

type ProductVariantValue = Database['public']['Tables']['product_variant_values']['Row'];
type ProductVariantValueInsert = Database['public']['Tables']['product_variant_values']['Insert'];

type ProductVariantCombination = Database['public']['Tables']['product_variant_combinations']['Row'];
type ProductVariantCombinationInsert = Database['public']['Tables']['product_variant_combinations']['Insert'];
type ProductVariantCombinationUpdate = Database['public']['Tables']['product_variant_combinations']['Update'];

type ProductVariantGroupPrice = Database['public']['Tables']['product_variant_group_prices']['Row'];
type ProductVariantGroupPriceInsert = Database['public']['Tables']['product_variant_group_prices']['Insert'];
type ProductVariantGroupPriceUpdate = Database['public']['Tables']['product_variant_group_prices']['Update'];

export interface VariantWithValues extends ProductVariant {
  values: ProductVariantValue[];
}

export interface CombinationWithValues extends ProductVariantCombination {
  values: Array<{
    id: string;
    variant_name: string;
    value: string;
  }>;
}

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

export class VariantRepository {
  constructor(private storeId: string) {}

  // Variants CRUD
  async getVariantsByProduct(productId: string): Promise<VariantWithValues[]> {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        values:product_variant_values (
          id,
          value,
          position,
          created_at,
          updated_at
        )
      `)
      .eq('product_id', productId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data as VariantWithValues[];
  }

  async createVariant(variant: Omit<ProductVariantInsert, 'id'>): Promise<ProductVariant> {
    const { data, error } = await supabase
      .from('product_variants')
      .insert(variant)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateVariant(id: string, variant: ProductVariantUpdate): Promise<ProductVariant> {
    const { data, error } = await supabase
      .from('product_variants')
      .update(variant)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVariant(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Variant Values CRUD
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

  // Combinations CRUD
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

  // Group Prices CRUD
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
