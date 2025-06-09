import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { VariantRepository } from '@/repositories/VariantRepository';
import { VariantValueRepository } from '@/repositories/VariantValueRepository';
import { VariantCombinationRepository } from '@/repositories/VariantCombinationRepository';
import { VariantGroupPriceRepository } from '@/repositories/VariantGroupPriceRepository';
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';

import { CategoryService } from '@/services/CategoryService';
import { ProductService } from '@/services/ProductService';
import { UserService } from '@/services/UserService';
import { ProfileService } from '@/services/ProfileService';
import { ManufacturerService } from '@/services/ManufacturerService';
import { PromotionService } from '@/services/PromotionService';
import { ProductPromotionService } from '@/services/ProductPromotionService';
import { OrderService } from '@/services/OrderService';
import { StoreSettingsService } from '@/services/StoreSettingsService';
import { AuthenticationService } from '@/services/AuthenticationService';
import { UserSessionService } from '@/services/UserSessionService';
import { VariantService } from '@/services/VariantService';
import { ShippingService } from '@/services/ShippingService';

export function createServices(storeId: string) {
  console.log('Creating services for storeId:', storeId);
  
  // Repositories
  const categoryRepository = new CategoryRepository(storeId);
  const productRepository = new ProductRepository(storeId);
  const userRepository = new UserRepository(storeId);
  const manufacturerRepository = new ManufacturerRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);
  const orderRepository = new OrderRepository(storeId);
  const storeSettingsRepository = new StoreSettingsRepository(storeId);
  const variantRepository = new VariantRepository(storeId);
  const variantValueRepository = new VariantValueRepository(storeId);
  const variantCombinationRepository = new VariantCombinationRepository(storeId);
  const variantGroupPriceRepository = new VariantGroupPriceRepository(storeId);
  const shippingMethodRepository = new ShippingMethodRepository(storeId);

  // Services
  const userService = new UserService(userRepository);
  const profileService = new ProfileService(userRepository);
  const categoryService = new CategoryService(categoryRepository);
  const manufacturerService = new ManufacturerService(manufacturerRepository);
  const promotionService = new PromotionService(promotionRepository);
  const productPromotionService = new ProductPromotionService(promotionRepository, productRepository);
  const productService = new ProductService(productRepository, productPromotionService);
  const orderService = new OrderService(orderRepository);
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);
  const authenticationService = new AuthenticationService();
  const userSessionService = new UserSessionService();
  const variantService = new VariantService(
    variantRepository,
    variantValueRepository,
    variantCombinationRepository,
    variantGroupPriceRepository
  );
  const shippingService = new ShippingService(shippingMethodRepository);

  console.log('Services created successfully');

  return {
    // Repositories
    categoryRepository,
    productRepository,
    userRepository,
    manufacturerRepository,
    promotionRepository,
    orderRepository,
    storeSettingsRepository,
    variantRepository,
    variantValueRepository,
    variantCombinationRepository,
    variantGroupPriceRepository,
    shippingMethodRepository,

    // Services
    userService,
    profileService,
    categoryService,
    manufacturerService,
    promotionService,
    productPromotionService,
    productService,
    orderService,
    storeSettingsService,
    authenticationService,
    userSessionService,
    variantService,
    shippingService,
  };
}
