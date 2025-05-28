
import { ProductRepository } from '@/repositories/ProductRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { ProductService } from '@/services/ProductService';
import { CategoryService } from '@/services/CategoryService';

export function createServices(storeId: string) {
  const productRepository = new ProductRepository(storeId);
  const categoryRepository = new CategoryRepository(storeId);
  const orderRepository = new OrderRepository(storeId);

  return {
    productService: new ProductService(productRepository),
    categoryService: new CategoryService(categoryRepository),
    productRepository,
    categoryRepository,
    orderRepository,
  };
}
