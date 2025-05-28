
import { VariantRepository, VariantWithValues, CombinationWithValues, GroupPriceWithValue } from '@/repositories/VariantRepository';

export interface VariantData {
  name: string;
  values: string[];
}

export interface CombinationData {
  variantValueIds: string[];
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  costPerItem?: number;
  stockQuantity: number;
  isActive: boolean;
}

export class VariantService {
  constructor(private variantRepository: VariantRepository) {}

  async getProductVariants(productId: string): Promise<VariantWithValues[]> {
    return this.variantRepository.getVariantsByProduct(productId);
  }

  async createProductVariants(productId: string, variants: VariantData[]): Promise<void> {
    for (const [index, variantData] of variants.entries()) {
      const variant = await this.variantRepository.createVariant({
        product_id: productId,
        name: variantData.name,
        position: index
      });

      for (const [valueIndex, value] of variantData.values.entries()) {
        await this.variantRepository.createVariantValue({
          variant_id: variant.id,
          value: value,
          position: valueIndex
        });
      }
    }
  }

  async generateAllCombinations(productId: string): Promise<string[][]> {
    const variants = await this.variantRepository.getVariantsByProduct(productId);
    
    if (variants.length === 0) return [];

    const allValueIds = variants.map(variant => 
      variant.values.map(value => value.id)
    );

    return this.cartesianProduct(allValueIds);
  }

  async createCombination(productId: string, combinationData: CombinationData): Promise<void> {
    await this.variantRepository.createCombination({
      product_id: productId,
      sku: combinationData.sku || null,
      price: combinationData.price || null,
      compare_at_price: combinationData.compareAtPrice || null,
      cost_per_item: combinationData.costPerItem || null,
      stock_quantity: combinationData.stockQuantity,
      is_active: combinationData.isActive
    }, combinationData.variantValueIds);
  }

  async updateCombination(combinationId: string, combinationData: Partial<CombinationData>): Promise<void> {
    const updateData: any = {};
    
    if (combinationData.sku !== undefined) updateData.sku = combinationData.sku || null;
    if (combinationData.price !== undefined) updateData.price = combinationData.price || null;
    if (combinationData.compareAtPrice !== undefined) updateData.compare_at_price = combinationData.compareAtPrice || null;
    if (combinationData.costPerItem !== undefined) updateData.cost_per_item = combinationData.costPerItem || null;
    if (combinationData.stockQuantity !== undefined) updateData.stock_quantity = combinationData.stockQuantity;
    if (combinationData.isActive !== undefined) updateData.is_active = combinationData.isActive;

    await this.variantRepository.updateCombination(combinationId, updateData);
  }

  async getProductCombinations(productId: string): Promise<CombinationWithValues[]> {
    return this.variantRepository.getCombinationsByProduct(productId);
  }

  async applyGroupPrice(productId: string, variantValueId: string, price: number): Promise<void> {
    // Set group price
    await this.variantRepository.upsertGroupPrice({
      product_id: productId,
      variant_value_id: variantValueId,
      group_price: price
    });

    // Apply to combinations that don't have individual prices
    const combinations = await this.variantRepository.getCombinationsByProduct(productId);
    
    for (const combination of combinations) {
      const hasThisValue = combination.values.some(v => v.id === variantValueId);
      const hasIndividualPrice = combination.price !== null;
      
      if (hasThisValue && !hasIndividualPrice) {
        await this.variantRepository.updateCombination(combination.id, {
          price: price
        });
      }
    }
  }

  async getGroupPrices(productId: string): Promise<GroupPriceWithValue[]> {
    return this.variantRepository.getGroupPricesByProduct(productId);
  }

  async deleteVariant(variantId: string): Promise<void> {
    await this.variantRepository.deleteVariant(variantId);
  }

  async deleteCombination(combinationId: string): Promise<void> {
    await this.variantRepository.deleteCombination(combinationId);
  }

  private cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce<string[][]>((acc, curr) => {
      const result: string[][] = [];
      acc.forEach(a => {
        curr.forEach(b => {
          result.push([...a, b]);
        });
      });
      return result;
    }, [[]]);
  }
}
