
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { StoreSettingsService } from '@/services/StoreSettingsService';

export function createStoreServices() {
  console.log('Creating store services');

  // Repository (store settings don't need storeId for the repository constructor)
  const storeSettingsRepository = new StoreSettingsRepository();

  // Service
  const storeSettingsService = new StoreSettingsService(storeSettingsRepository);

  return {
    storeSettingsService,
  };
}
