
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { ShippingService } from '@/services/ShippingService';
import { ManufacturerService } from '@/services/ManufacturerService';

export function createShippingServices(storeId: string) {
  console.log('Creating shipping services for storeId:', storeId);

  // Repositories
  const shippingMethodRepository = new ShippingMethodRepository(storeId);
  const manufacturerRepository = new ManufacturerRepository(storeId);

  // Services
  const shippingService = new ShippingService(shippingMethodRepository);
  const manufacturerService = new ManufacturerService(manufacturerRepository);

  return {
    shippingService,
    manufacturerService,
  };
}
