
import { ProductRepository } from '@/repositories/ProductRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { ProductService } from '@/services/ProductService';
import { ProductQueryService } from '@/services/ProductQueryService';
import { ProductPromotionService } from '@/services/ProductPromotionService';

export function createProductServices(storeId: string) {
  console.log('Creating product services for storeId:', storeId);

  // Repositories
  const productRepository = new ProductRepository(storeId);
  const categoryRepository = new CategoryRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);

  // Services - fix constructor arguments to match service expectations
  const productService = new ProductService(productRepository);
  const productQueryService = new ProductQueryService(storeId);
  const productPromotionService = new ProductPromotionService(storeId);

  return {
    productService,
    productQueryService,
    productPromotionService,
  };
}
