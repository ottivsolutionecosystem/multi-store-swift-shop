
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { CategoryService } from '@/services/CategoryService';
import { ProductService } from '@/services/ProductService';
import { ManufacturerService } from '@/services/ManufacturerService';
import { PromotionService } from '@/services/PromotionService';
import { StoreSettingsService } from '@/services/StoreSettingsService';
import { ProfileService } from '@/services/ProfileService';

import { VariantRepository } from '@/repositories/VariantRepository';
import { VariantService } from '@/services/VariantService';

export function createServices(storeId: string) {
  console.log('Creating services for storeId:', storeId);
  
  // Repositories
  const categoryRepository = new CategoryRepository(storeId);
  const productRepository = new ProductRepository(storeId);
  const manufacturerRepository = new ManufacturerRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);
  const storeSettingsRepository = new StoreSettingsRepository(storeId);
  const variantRepository = new VariantRepository(storeId);

  // Services
  const categoryService = new CategoryService(categoryRepository);
  const productService = new ProductService(productRepository);
  const manufacturerService = new ManufacturerService(manufacturerRepository);
  const promotionService = new PromotionService(promotionRepository);
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);
  const variantService = new VariantService(variantRepository);
  const profileService = new ProfileService();

  return {
    categoryService,
    productService,
    manufacturerService,
    promotionService,
    storeSettingsService,
    variantService,
    profileService
  };
}
