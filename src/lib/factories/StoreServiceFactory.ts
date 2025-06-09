
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { StoreSettingsService } from '@/services/StoreSettingsService';

export function createStoreServices() {
  console.log('Creating store services');

  // Repository - StoreSettingsRepository expects storeId but we'll handle it differently
  const storeSettingsRepository = new StoreSettingsRepository();

  // Service
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);

  return {
    storeSettingsService,
  };
}
