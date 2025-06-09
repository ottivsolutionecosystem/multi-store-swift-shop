
import { OrderRepository } from '@/repositories/OrderRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { OrderService } from '@/services/OrderService';

export function createOrderServices(storeId: string) {
  console.log('Creating order services for storeId:', storeId);

  // Repositories
  const orderRepository = new OrderRepository(storeId);
  const productRepository = new ProductRepository(storeId);

  // Service - OrderService only expects orderRepository as first argument
  const orderService = new OrderService(orderRepository);

  return {
    orderService,
  };
}
