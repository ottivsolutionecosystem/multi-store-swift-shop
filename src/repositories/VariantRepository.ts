
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { VariantValueRepository } from './VariantValueRepository';
import { VariantCombinationRepository, CombinationWithValues } from './VariantCombinationRepository';
import { VariantGroupPriceRepository, GroupPriceWithValue } from './VariantGroupPriceRepository';

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

export interface VariantWithValues extends ProductVariant {
  values: ProductVariantValue[];
}

// Re-export interfaces for backward compatibility
export type { CombinationWithValues, GroupPriceWithValue };

export class VariantRepository {
  private variantValueRepository: VariantValueRepository;
  private variantCombinationRepository: VariantCombinationRepository;
  private variantGroupPriceRepository: VariantGroupPriceRepository;

  constructor(private storeId: string) {
    this.variantValueRepository = new VariantValueRepository(storeId);
    this.variantCombinationRepository = new VariantCombinationRepository(storeId);
    this.variantGroupPriceRepository = new VariantGroupPriceRepository(storeId);
  }

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

  // Variant Values CRUD - Delegate to specialized repository
  async createVariantValue(value: Omit<ProductVariantValueInsert, 'id'>): Promise<ProductVariantValue> {
    return this.variantValueRepository.createVariantValue(value);
  }

  async deleteVariantValue(id: string): Promise<void> {
    return this.variantValueRepository.deleteVariantValue(id);
  }

  // Combinations CRUD - Delegate to specialized repository
  async getCombinationsByProduct(productId: string): Promise<CombinationWithValues[]> {
    return this.variantCombinationRepository.getCombinationsByProduct(productId);
  }

  async createCombination(
    combination: Omit<ProductVariantCombinationInsert, 'id'>,
    variantValueIds: string[]
  ): Promise<ProductVariantCombination> {
    return this.variantCombinationRepository.createCombination(combination, variantValueIds);
  }

  async updateCombination(id: string, combination: ProductVariantCombinationUpdate): Promise<ProductVariantCombination> {
    return this.variantCombinationRepository.updateCombination(id, combination);
  }

  async deleteCombination(id: string): Promise<void> {
    return this.variantCombinationRepository.deleteCombination(id);
  }

  // Group Prices CRUD - Delegate to specialized repository
  async getGroupPricesByProduct(productId: string): Promise<GroupPriceWithValue[]> {
    return this.variantGroupPriceRepository.getGroupPricesByProduct(productId);
  }

  async upsertGroupPrice(groupPrice: ProductVariantGroupPriceInsert): Promise<ProductVariantGroupPrice> {
    return this.variantGroupPriceRepository.upsertGroupPrice(groupPrice);
  }

  async deleteGroupPrice(productId: string, variantValueId: string): Promise<void> {
    return this.variantGroupPriceRepository.deleteGroupPrice(productId, variantValueId);
  }
}
