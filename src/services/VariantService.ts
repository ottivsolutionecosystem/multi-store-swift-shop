
import { Database } from '@/integrations/supabase/types';
import { VariantRepository, CombinationCreateData, CombinationUpdateData } from '@/repositories/VariantRepository';

export interface VariantData {
  name: string;
  values: string[];
}

export class VariantService {
  constructor(private variantRepository: VariantRepository) {}

  async createProductVariants(productId: string, variants: VariantData[]): Promise<void> {
    console.log('VariantService.createProductVariants - productId:', productId, 'variants:', variants);
    return this.variantRepository.createProductVariants(productId, variants);
  }

  async getProductVariants(productId: string) {
    console.log('VariantService.getProductVariants - productId:', productId);
    const result = await this.variantRepository.getProductVariants(productId);
    console.log('VariantService.getProductVariants - result:', result);
    return result;
  }

  async getProductCombinations(productId: string) {
    console.log('VariantService.getProductCombinations - productId:', productId);
    const result = await this.variantRepository.getProductCombinations(productId);
    console.log('VariantService.getProductCombinations - result:', result);
    return result;
  }

  async getGroupPrices(productId: string) {
    console.log('VariantService.getGroupPrices - productId:', productId);
    const result = await this.variantRepository.getGroupPrices(productId);
    console.log('VariantService.getGroupPrices - result:', result);
    return result;
  }

  async generateAllCombinations(productId: string): Promise<string[][]> {
    console.log('VariantService.generateAllCombinations - productId:', productId);
    const result = await this.variantRepository.generateAllCombinations(productId);
    console.log('VariantService.generateAllCombinations - result:', result);
    return result;
  }

  async createCombination(productId: string, data: CombinationCreateData) {
    console.log('VariantService.createCombination - productId:', productId, 'data:', data);
    const result = await this.variantRepository.createCombination(productId, data);
    console.log('VariantService.createCombination - result:', result);
    return result;
  }

  async updateCombination(combinationId: string, updates: CombinationUpdateData) {
    console.log('VariantService.updateCombination - combinationId:', combinationId, 'updates:', updates);
    
    try {
      const result = await this.variantRepository.updateCombination(combinationId, updates);
      console.log('VariantService.updateCombination - success, result:', result);
      return result;
    } catch (error) {
      console.error('VariantService.updateCombination - error:', error);
      
      // Log additional debugging info
      console.log('VariantService.updateCombination - attempting to debug RLS access...');
      
      // Try to get current user info for debugging
      try {
        const { ProfileService } = await import('./ProfileService');
        const profileService = new ProfileService();
        await profileService.debugUserAccess();
      } catch (debugError) {
        console.error('VariantService.updateCombination - debug error:', debugError);
      }
      
      throw error;
    }
  }

  async applyGroupPrice(productId: string, variantValueId: string, price: number) {
    console.log('VariantService.applyGroupPrice - productId:', productId, 'variantValueId:', variantValueId, 'price:', price);
    const result = await this.variantRepository.applyGroupPrice(productId, variantValueId, price);
    console.log('VariantService.applyGroupPrice - result:', result);
    return result;
  }
}
