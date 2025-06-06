

import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { VariantRepository } from '@/repositories/VariantRepository';
import { VariantValueRepository } from '@/repositories/VariantValueRepository';
import { VariantCombinationRepository } from '@/repositories/VariantCombinationRepository';
import { VariantGroupPriceRepository } from '@/repositories/VariantGroupPriceRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { CategoryService } from '@/services/CategoryService';
import { ProductService } from '@/services/ProductService';
import { ManufacturerService } from '@/services/ManufacturerService';
import { VariantService } from '@/services/VariantService';
import { CombinationService } from '@/services/CombinationService';
import { GroupPricingService } from '@/services/GroupPricingService';
import { VariantManagementService } from '@/services/VariantManagementService';
import { ProductQueryService } from '@/services/ProductQueryService';
import { PromotionService } from '@/services/PromotionService';
import { ProductPromotionService } from '@/services/ProductPromotionService';
import { StoreSettingsService } from '@/services/StoreSettingsService';
import { ProfileService } from '@/services/ProfileService';
import { UserService } from '@/services/UserService';

export function createServices(storeId: string) {
  console.log('Creating services for storeId:', storeId);
  
  // Repositories
  const categoryRepository = new CategoryRepository(storeId);
  const productRepository = new ProductRepository(storeId);
  const manufacturerRepository = new ManufacturerRepository(storeId);
  const variantRepository = new VariantRepository(storeId);
  const variantValueRepository = new VariantValueRepository(storeId);
  const variantCombinationRepository = new VariantCombinationRepository(storeId);
  const variantGroupPriceRepository = new VariantGroupPriceRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);
  const storeSettingsRepository = new StoreSettingsRepository(storeId);
  
  // Services - fix constructor arguments
  const categoryService = new CategoryService(categoryRepository);
  const productService = new ProductService(productRepository);
  const manufacturerService = new ManufacturerService(manufacturerRepository);
  const variantService = new VariantService(variantRepository);
  const combinationService = new CombinationService(variantRepository);
  const groupPricingService = new GroupPricingService(variantRepository);
  const variantManagementService = new VariantManagementService(variantService);
  const productQueryService = new ProductQueryService(storeId);
  const promotionService = new PromotionService(promotionRepository);
  const productPromotionService = new ProductPromotionService(storeId);
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);
  
  // Add UserService
  const userService = new UserService(storeId);
  
  return {
    categoryService,
    productService,
    manufacturerService,
    variantService,
    combinationService,
    groupPricingService,
    variantManagementService,
    productQueryService,
    promotionService,
    productPromotionService,
    storeSettingsService,
    userService, // Add to exports
    profileService: new ProfileService(), // Keep for backward compatibility
  };
}
