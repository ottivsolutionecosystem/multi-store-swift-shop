
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { StoreSettingsService } from '@/services/StoreSettingsService';

export function createStoreServices(storeId: string) {
  console.log('Creating store services for storeId:', storeId);

  // Repository - pass storeId to StoreSettingsRepository
  const storeSettingsRepository = new StoreSettingsRepository(storeId);

  // Service
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);

  return {
    storeSettingsService,
  };
}
