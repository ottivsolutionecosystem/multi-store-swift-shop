
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { PromotionService } from '@/services/PromotionService';

export function createPromotionServices(storeId: string) {
  console.log('Creating promotion services for storeId:', storeId);

  // Repository
  const promotionRepository = new PromotionRepository(storeId);

  // Service
  const promotionService = new PromotionService(promotionRepository);

  return {
    promotionService,
  };
}
