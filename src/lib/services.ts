
import { ProductRepository } from '@/repositories/ProductRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { VariantRepository } from '@/repositories/VariantRepository';
import { VariantValueRepository } from '@/repositories/VariantValueRepository';
import { VariantCombinationRepository } from '@/repositories/VariantCombinationRepository';
import { VariantGroupPriceRepository } from '@/repositories/VariantGroupPriceRepository';
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { UserAddressRepository } from '@/repositories/UserAddressRepository';

import { ProductService } from '@/services/ProductService';
import { CategoryService } from '@/services/CategoryService';
import { UserService } from '@/services/UserService';
import { OrderService } from '@/services/OrderService';
import { PromotionService } from '@/services/PromotionService';
import { StoreSettingsService } from '@/services/StoreSettingsService';
import { VariantService } from '@/services/VariantService';
import { VariantManagementService } from '@/services/VariantManagementService';
import { CombinationService } from '@/services/CombinationService';
import { GroupPricingService } from '@/services/GroupPricingService';
import { ManufacturerService } from '@/services/ManufacturerService';
import { ShippingService } from '@/services/ShippingService';
import { UserAddressService } from '@/services/UserAddressService';
import { ProductQueryService } from '@/services/ProductQueryService';
import { ProductPromotionService } from '@/services/ProductPromotionService';
import { ProfileService } from '@/services/ProfileService';
import { StoreAccessService } from '@/services/StoreAccessService';
import { UserSessionService } from '@/services/UserSessionService';
import { UserProfileManagementService } from '@/services/UserProfileManagementService';
import { AuthenticationService } from '@/services/AuthenticationService';

export function createServices(storeId: string) {
  console.log('Creating services for storeId:', storeId);

  // Repositories
  const productRepository = new ProductRepository(storeId);
  const categoryRepository = new CategoryRepository(storeId);
  const userRepository = new UserRepository();
  const orderRepository = new OrderRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);
  const storeSettingsRepository = new StoreSettingsRepository();
  const variantRepository = new VariantRepository(storeId);
  const variantValueRepository = new VariantValueRepository(storeId);
  const variantCombinationRepository = new VariantCombinationRepository(storeId);
  const variantGroupPriceRepository = new VariantGroupPriceRepository(storeId);
  const manufacturerRepository = new ManufacturerRepository(storeId);
  const shippingMethodRepository = new ShippingMethodRepository(storeId);
  const userAddressRepository = new UserAddressRepository();

  // Services
  const productService = new ProductService(productRepository);
  const categoryService = new CategoryService(categoryRepository);
  const userService = new UserService(userRepository);
  const orderService = new OrderService(orderRepository, productRepository);
  const promotionService = new PromotionService(promotionRepository);
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);
  const variantService = new VariantService(variantRepository, variantValueRepository);
  const variantManagementService = new VariantManagementService(variantRepository, variantValueRepository, variantCombinationRepository, variantGroupPriceRepository);
  const combinationService = new CombinationService(variantCombinationRepository);
  const groupPricingService = new GroupPricingService(variantGroupPriceRepository);
  const manufacturerService = new ManufacturerService(manufacturerRepository);
  const shippingService = new ShippingService(shippingMethodRepository);
  const userAddressService = new UserAddressService(userAddressRepository);
  const productQueryService = new ProductQueryService(productRepository, categoryRepository, promotionRepository);
  const productPromotionService = new ProductPromotionService(promotionRepository, productRepository);
  const profileService = new ProfileService(userRepository);
  const storeAccessService = new StoreAccessService(userRepository);
  const userSessionService = new UserSessionService();
  const userProfileManagementService = new UserProfileManagementService(userRepository);
  const authenticationService = new AuthenticationService();

  return {
    productService,
    categoryService,
    userService,
    orderService,
    promotionService,
    storeSettingsService,
    variantService,
    variantManagementService,
    combinationService,
    groupPricingService,
    manufacturerService,
    shippingService,
    userAddressService,
    productQueryService,
    productPromotionService,
    profileService,
    storeAccessService,
    userSessionService,
    userProfileManagementService,
    authenticationService,
  };
}
