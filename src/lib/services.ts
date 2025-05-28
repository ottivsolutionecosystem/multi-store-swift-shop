
import { ProductRepository } from '@/repositories/ProductRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { ProductService } from '@/services/ProductService';
import { CategoryService } from '@/services/CategoryService';
import { PromotionService } from '@/services/PromotionService';
import { StoreSettingsService } from '@/services/StoreSettingsService';
import { ProfileService } from '@/services/ProfileService';

export function createServices(storeId: string) {
  const productRepository = new ProductRepository(storeId);
  const categoryRepository = new CategoryRepository(storeId);
  const orderRepository = new OrderRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);
  const storeSettingsRepository = new StoreSettingsRepository(storeId);
  const profileService = new ProfileService();

  return {
    productService: new ProductService(productRepository),
    categoryService: new CategoryService(categoryRepository),
    promotionService: new PromotionService(promotionRepository),
    storeSettingsService: new StoreSettingsService(storeSettingsRepository),
    profileService,
    productRepository,
    categoryRepository,
    orderRepository,
    promotionRepository,
    storeSettingsRepository,
  };
}
