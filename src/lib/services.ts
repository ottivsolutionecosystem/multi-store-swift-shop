
import { ProductRepository } from '@/repositories/ProductRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { VariantRepository } from '@/repositories/VariantRepository';
import { VariantValueRepository } from '@/repositories/VariantValueRepository';
import { VariantCombinationRepository } from '@/repositories/VariantCombinationRepository';
import { VariantGroupPriceRepository } from '@/repositories/VariantGroupPriceRepository';

import { ProductService } from '@/services/ProductService';
import { CategoryService } from '@/services/CategoryService';
import { PromotionService } from '@/services/PromotionService';
import { OrderService } from '@/services/OrderService';
import { UserService } from '@/services/UserService';
import { ProfileService } from '@/services/ProfileService';
import { StoreSettingsService } from '@/services/StoreSettingsService';
import { ManufacturerService } from '@/services/ManufacturerService';
import { VariantService } from '@/services/VariantService';
import { VariantManagementService } from '@/services/VariantManagementService';
import { CombinationService } from '@/services/CombinationService';
import { GroupPricingService } from '@/services/GroupPricingService';
import { ProductPromotionService } from '@/services/ProductPromotionService';
import { ProductQueryService } from '@/services/ProductQueryService';

export function createServices(storeId: string) {
  console.log('createServices - Creating services for storeId:', storeId);
  
  // Repositories
  const productRepository = new ProductRepository(storeId);
  const categoryRepository = new CategoryRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);
  const orderRepository = new OrderRepository(storeId);
  const userRepository = new UserRepository(storeId);
  const storeSettingsRepository = new StoreSettingsRepository(storeId);
  const manufacturerRepository = new ManufacturerRepository(storeId);
  const variantRepository = new VariantRepository(storeId);
  const variantValueRepository = new VariantValueRepository(storeId);
  const variantCombinationRepository = new VariantCombinationRepository(storeId);
  const variantGroupPriceRepository = new VariantGroupPriceRepository(storeId);

  // Services
  const productService = new ProductService(productRepository);
  const categoryService = new CategoryService(categoryRepository);
  const promotionService = new PromotionService(promotionRepository);
  const orderService = new OrderService(orderRepository);
  const userService = new UserService(userRepository);
  const profileService = new ProfileService(userRepository);
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);
  const manufacturerService = new ManufacturerService(manufacturerRepository);
  const variantService = new VariantService(variantRepository, variantValueRepository);
  const variantManagementService = new VariantManagementService(
    variantRepository,
    variantValueRepository,
    variantCombinationRepository
  );
  const combinationService = new CombinationService(variantCombinationRepository, variantValueRepository);
  const groupPricingService = new GroupPricingService(variantGroupPriceRepository);
  const productPromotionService = new ProductPromotionService(productRepository, promotionRepository);
  const productQueryService = new ProductQueryService(productRepository, categoryRepository, promotionRepository);

  return {
    productService,
    categoryService,
    promotionService,
    orderService,
    userService,
    profileService,
    storeSettingsService,
    manufacturerService,
    variantService,
    variantManagementService,
    combinationService,
    groupPricingService,
    productPromotionService,
    productQueryService,
  };
}
