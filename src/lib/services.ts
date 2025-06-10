
import { createProductServices } from '@/lib/factories/ProductServiceFactory';
import { createCategoryServices } from '@/lib/factories/CategoryServiceFactory';
import { createUserServices } from '@/lib/factories/UserServiceFactory';
import { createOrderServices } from '@/lib/factories/OrderServiceFactory';
import { createPromotionServices } from '@/lib/factories/PromotionServiceFactory';
import { createVariantServices } from '@/lib/factories/VariantServiceFactory';
import { createStoreServices } from '@/lib/factories/StoreServiceFactory';
import { createShippingServices } from '@/lib/factories/ShippingServiceFactory';
import { DigitalWalletServiceFactory } from './factories/DigitalWalletServiceFactory';

export function createServices(storeId: string) {
  console.log('Creating services for store:', storeId);

  // Create all service groups - pass storeId to all factories
  const productServices = createProductServices(storeId);
  const categoryServices = createCategoryServices(storeId);
  const userServices = createUserServices(storeId);
  const orderServices = createOrderServices(storeId);
  const promotionServices = createPromotionServices(storeId);
  const variantServices = createVariantServices(storeId);
  const storeServices = createStoreServices(storeId);
  const shippingServices = createShippingServices(storeId);

  // Return combined services object
  return {
    ...productServices,
    ...categoryServices,
    ...userServices,
    ...orderServices,
    ...promotionServices,
    ...variantServices,
    ...storeServices,
    ...shippingServices,
    digitalWalletService: DigitalWalletServiceFactory.create(),
  };
}
