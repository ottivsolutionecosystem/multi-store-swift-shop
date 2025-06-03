
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
    console.log('VariantService - getting variants for product:', productId);
    try {
      const variants = await this.variantRepository.getVariantsByProduct(productId);
      console.log('VariantService - variants loaded:', variants);
      return variants;
    } catch (error) {
      console.error('VariantService - error getting variants:', error);
      throw error;
    }
  }

  async createProductVariants(productId: string, variants: VariantData[]): Promise<void> {
    console.log('VariantService - creating variants for product:', productId, variants);
    try {
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
      console.log('VariantService - variants created successfully');
    } catch (error) {
      console.error('VariantService - error creating variants:', error);
      throw error;
    }
  }

  async generateAllCombinations(productId: string): Promise<string[][]> {
    console.log('VariantService - generating combinations for product:', productId);
    try {
      const variants = await this.variantRepository.getVariantsByProduct(productId);
      
      if (variants.length === 0) return [];

      const allValueIds = variants.map(variant => 
        variant.values.map(value => value.id)
      );

      const combinations = this.cartesianProduct(allValueIds);
      console.log('VariantService - combinations generated:', combinations);
      return combinations;
    } catch (error) {
      console.error('VariantService - error generating combinations:', error);
      throw error;
    }
  }

  async createCombination(productId: string, combinationData: CombinationData): Promise<void> {
    console.log('VariantService - creating combination for product:', productId, combinationData);
    try {
      await this.variantRepository.createCombination({
        product_id: productId,
        sku: combinationData.sku || null,
        price: combinationData.price || null,
        compare_at_price: combinationData.compareAtPrice || null,
        cost_per_item: combinationData.costPerItem || null,
        stock_quantity: combinationData.stockQuantity,
        is_active: combinationData.isActive
      }, combinationData.variantValueIds);
      console.log('VariantService - combination created successfully');
    } catch (error) {
      console.error('VariantService - error creating combination:', error);
      throw error;
    }
  }

  async updateCombination(combinationId: string, combinationData: Partial<CombinationData>): Promise<void> {
    console.log('VariantService - updating combination:', combinationId, 'with data:', combinationData);
    console.log('VariantService - available properties:', Object.keys(combinationData));
    
    try {
      const updateData: any = {};
      
      // Check for properties in the data object (both camelCase and snake_case)
      const data = combinationData as any;
      
      // Handle all possible property mappings
      if ('sku' in data && data.sku !== undefined) {
        updateData.sku = data.sku || null;
      }
      
      if ('price' in data && data.price !== undefined) {
        updateData.price = data.price || null;
      }
      
      if ('compareAtPrice' in data && data.compareAtPrice !== undefined) {
        updateData.compare_at_price = data.compareAtPrice || null;
      }
      
      if ('costPerItem' in data && data.costPerItem !== undefined) {
        updateData.cost_per_item = data.costPerItem || null;
      }
      
      if ('stockQuantity' in data && data.stockQuantity !== undefined) {
        updateData.stock_quantity = data.stockQuantity;
      }
      
      if ('isActive' in data && data.isActive !== undefined) {
        updateData.is_active = data.isActive;
      }

      // Handle snake_case properties directly
      if ('stock_quantity' in data && data.stock_quantity !== undefined) {
        updateData.stock_quantity = data.stock_quantity;
      }
      
      if ('is_active' in data && data.is_active !== undefined) {
        updateData.is_active = data.is_active;
      }
      
      if ('compare_at_price' in data && data.compare_at_price !== undefined) {
        updateData.compare_at_price = data.compare_at_price;
      }
      
      if ('cost_per_item' in data && data.cost_per_item !== undefined) {
        updateData.cost_per_item = data.cost_per_item;
      }

      console.log('VariantService - final update data:', updateData);
      console.log('VariantService - update data keys:', Object.keys(updateData));
      
      // Validate that we have data to update
      if (Object.keys(updateData).length === 0) {
        console.warn('VariantService - no valid update data provided. Original data:', combinationData);
        throw new Error('No valid data provided for update');
      }

      const result = await this.variantRepository.updateCombination(combinationId, updateData);
      console.log('VariantService - combination updated successfully:', result);
    } catch (error) {
      console.error('VariantService - error updating combination:', error);
      throw error;
    }
  }

  async getProductCombinations(productId: string): Promise<CombinationWithValues[]> {
    console.log('VariantService - getting combinations for product:', productId);
    try {
      const combinations = await this.variantRepository.getCombinationsByProduct(productId);
      console.log('VariantService - combinations loaded:', combinations);
      return combinations;
    } catch (error) {
      console.error('VariantService - error getting combinations:', error);
      throw error;
    }
  }

  async applyGroupPrice(productId: string, variantValueId: string, price: number): Promise<void> {
    console.log('VariantService - applying group price:', { productId, variantValueId, price });
    try {
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
      console.log('VariantService - group price applied successfully');
    } catch (error) {
      console.error('VariantService - error applying group price:', error);
      throw error;
    }
  }

  async getGroupPrices(productId: string): Promise<GroupPriceWithValue[]> {
    console.log('VariantService - getting group prices for product:', productId);
    try {
      const groupPrices = await this.variantRepository.getGroupPricesByProduct(productId);
      console.log('VariantService - group prices loaded:', groupPrices);
      return groupPrices;
    } catch (error) {
      console.error('VariantService - error getting group prices:', error);
      throw error;
    }
  }

  async deleteVariant(variantId: string): Promise<void> {
    console.log('VariantService - deleting variant:', variantId);
    try {
      await this.variantRepository.deleteVariant(variantId);
      console.log('VariantService - variant deleted successfully');
    } catch (error) {
      console.error('VariantService - error deleting variant:', error);
      throw error;
    }
  }

  async deleteCombination(combinationId: string): Promise<void> {
    console.log('VariantService - deleting combination:', combinationId);
    try {
      await this.variantRepository.deleteCombination(combinationId);
      console.log('VariantService - combination deleted successfully');
    } catch (error) {
      console.error('VariantService - error deleting combination:', error);
      throw error;
    }
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
