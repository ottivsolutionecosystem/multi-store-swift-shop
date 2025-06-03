
import { VariantRepository, GroupPriceWithValue } from '@/repositories/VariantRepository';

export class GroupPricingService {
  constructor(private variantRepository: VariantRepository) {}

  async applyGroupPrice(productId: string, variantValueId: string, price: number): Promise<void> {
    console.log('GroupPricingService - applying group price:', { productId, variantValueId, price });
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
      console.log('GroupPricingService - group price applied successfully');
    } catch (error) {
      console.error('GroupPricingService - error applying group price:', error);
      throw error;
    }
  }

  async getGroupPrices(productId: string): Promise<GroupPriceWithValue[]> {
    console.log('GroupPricingService - getting group prices for product:', productId);
    try {
      const groupPrices = await this.variantRepository.getGroupPricesByProduct(productId);
      console.log('GroupPricingService - group prices loaded:', groupPrices);
      return groupPrices;
    } catch (error) {
      console.error('GroupPricingService - error getting group prices:', error);
      throw error;
    }
  }
}
