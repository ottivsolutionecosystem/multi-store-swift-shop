
import { VariantRepository, CombinationWithValues } from '@/repositories/VariantRepository';
import { CombinationData, CombinationUpdateData } from '@/types/variant';

export class CombinationService {
  constructor(private variantRepository: VariantRepository) {}

  async generateAllCombinations(productId: string): Promise<string[][]> {
    console.log('CombinationService - generating combinations for product:', productId);
    try {
      const variants = await this.variantRepository.getVariantsByProduct(productId);
      
      if (variants.length === 0) return [];

      const allValueIds = variants.map(variant => 
        variant.values.map(value => value.id)
      );

      const combinations = this.cartesianProduct(allValueIds);
      console.log('CombinationService - combinations generated:', combinations);
      return combinations;
    } catch (error) {
      console.error('CombinationService - error generating combinations:', error);
      throw error;
    }
  }

  async createCombination(productId: string, combinationData: CombinationData): Promise<void> {
    console.log('CombinationService - creating combination for product:', productId, combinationData);
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
      console.log('CombinationService - combination created successfully');
    } catch (error) {
      console.error('CombinationService - error creating combination:', error);
      throw error;
    }
  }

  async updateCombination(combinationId: string, combinationData: Partial<CombinationUpdateData>): Promise<void> {
    console.log('CombinationService - updating combination:', combinationId, 'with data:', combinationData);
    console.log('CombinationService - available properties:', Object.keys(combinationData));
    
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

      console.log('CombinationService - final update data:', updateData);
      console.log('CombinationService - update data keys:', Object.keys(updateData));
      
      // Validate that we have data to update
      if (Object.keys(updateData).length === 0) {
        console.warn('CombinationService - no valid update data provided. Original data:', combinationData);
        throw new Error('No valid data provided for update');
      }

      const result = await this.variantRepository.updateCombination(combinationId, updateData);
      console.log('CombinationService - combination updated successfully:', result);
    } catch (error) {
      console.error('CombinationService - error updating combination:', error);
      throw error;
    }
  }

  async getProductCombinations(productId: string): Promise<CombinationWithValues[]> {
    console.log('CombinationService - getting combinations for product:', productId);
    try {
      const combinations = await this.variantRepository.getCombinationsByProduct(productId);
      console.log('CombinationService - combinations loaded:', combinations);
      return combinations;
    } catch (error) {
      console.error('CombinationService - error getting combinations:', error);
      throw error;
    }
  }

  async deleteCombination(combinationId: string): Promise<void> {
    console.log('CombinationService - deleting combination:', combinationId);
    try {
      await this.variantRepository.deleteCombination(combinationId);
      console.log('CombinationService - combination deleted successfully');
    } catch (error) {
      console.error('CombinationService - error deleting combination:', error);
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
