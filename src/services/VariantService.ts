
import { VariantRepository, VariantWithValues, CombinationWithValues, GroupPriceWithValue } from '@/repositories/VariantRepository';
import { VariantData, CombinationData, CombinationUpdateData } from '@/types/variant';
import { VariantManagementService } from './VariantManagementService';
import { CombinationService } from './CombinationService';
import { GroupPricingService } from './GroupPricingService';

export class VariantService {
  private variantManagementService: VariantManagementService;
  private combinationService: CombinationService;
  private groupPricingService: GroupPricingService;

  constructor(private variantRepository: VariantRepository) {
    this.variantManagementService = new VariantManagementService(variantRepository);
    this.combinationService = new CombinationService(variantRepository);
    this.groupPricingService = new GroupPricingService(variantRepository);
  }

  // Variant Management Methods
  async getProductVariants(productId: string): Promise<VariantWithValues[]> {
    return this.variantManagementService.getProductVariants(productId);
  }

  async createProductVariants(productId: string, variants: VariantData[]): Promise<void> {
    return this.variantManagementService.createProductVariants(productId, variants);
  }

  async deleteVariant(variantId: string): Promise<void> {
    return this.variantManagementService.deleteVariant(variantId);
  }

  // Combination Methods
  async generateAllCombinations(productId: string): Promise<string[][]> {
    return this.combinationService.generateAllCombinations(productId);
  }

  async createCombination(productId: string, combinationData: CombinationData): Promise<void> {
    return this.combinationService.createCombination(productId, combinationData);
  }

  async updateCombination(combinationId: string, combinationData: Partial<CombinationUpdateData>): Promise<void> {
    return this.combinationService.updateCombination(combinationId, combinationData);
  }

  async getProductCombinations(productId: string): Promise<CombinationWithValues[]> {
    return this.combinationService.getProductCombinations(productId);
  }

  async deleteCombination(combinationId: string): Promise<void> {
    return this.combinationService.deleteCombination(combinationId);
  }

  // Group Pricing Methods
  async applyGroupPrice(productId: string, variantValueId: string, price: number): Promise<void> {
    return this.groupPricingService.applyGroupPrice(productId, variantValueId, price);
  }

  async getGroupPrices(productId: string): Promise<GroupPriceWithValue[]> {
    return this.groupPricingService.getGroupPrices(productId);
  }
}

// Export the interfaces for backward compatibility
export type { VariantData, CombinationData };
