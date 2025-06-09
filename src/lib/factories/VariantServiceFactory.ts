
import { VariantRepository } from '@/repositories/VariantRepository';
import { VariantValueRepository } from '@/repositories/VariantValueRepository';
import { VariantCombinationRepository } from '@/repositories/VariantCombinationRepository';
import { VariantGroupPriceRepository } from '@/repositories/VariantGroupPriceRepository';
import { VariantService } from '@/services/VariantService';
import { VariantManagementService } from '@/services/VariantManagementService';
import { CombinationService } from '@/services/CombinationService';
import { GroupPricingService } from '@/services/GroupPricingService';

export function createVariantServices(storeId: string) {
  console.log('Creating variant services for storeId:', storeId);

  // Repositories
  const variantRepository = new VariantRepository(storeId);
  const variantValueRepository = new VariantValueRepository(storeId);
  const variantCombinationRepository = new VariantCombinationRepository(storeId);
  const variantGroupPriceRepository = new VariantGroupPriceRepository(storeId);

  // Services - fix constructor arguments to match service expectations
  const variantService = new VariantService(variantRepository);
  const variantManagementService = new VariantManagementService(variantRepository);
  const combinationService = new CombinationService(variantRepository);
  const groupPricingService = new GroupPricingService(variantRepository);

  return {
    variantService,
    variantManagementService,
    combinationService,
    groupPricingService,
  };
}
