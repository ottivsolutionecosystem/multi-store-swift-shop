
import { ProductRepository } from '@/repositories/ProductRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { ProductService } from '@/services/ProductService';
import { CategoryService } from '@/services/CategoryService';
import { PromotionService } from '@/services/PromotionService';

export function createServices(storeId: string) {
  const productRepository = new ProductRepository(storeId);
  const categoryRepository = new CategoryRepository(storeId);
  const orderRepository = new OrderRepository(storeId);
  const promotionRepository = new PromotionRepository(storeId);

  return {
    productService: new ProductService(productRepository),
    categoryService: new CategoryService(categoryRepository),
    promotionService: new PromotionService(promotionRepository),
    productRepository,
    categoryRepository,
    orderRepository,
    promotionRepository,
  };
}
