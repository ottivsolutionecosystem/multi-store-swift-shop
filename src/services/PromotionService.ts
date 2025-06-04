
import { PromotionRepository } from '@/repositories/PromotionRepository';
import { Database } from '@/integrations/supabase/types';

type Promotion = Database['public']['Tables']['promotions']['Row'];
type PromotionInsert = Database['public']['Tables']['promotions']['Insert'];
type PromotionUpdate = Database['public']['Tables']['promotions']['Update'];

export class PromotionService {
  constructor(private promotionRepository: PromotionRepository) {}

  async getAllPromotions(): Promise<Promotion[]> {
    return this.promotionRepository.findAll();
  }

  async getActivePromotions(): Promise<Promotion[]> {
    return this.promotionRepository.findActive();
  }

  async getPromotionsByProduct(productId: string): Promise<Promotion[]> {
    return this.promotionRepository.findActiveByProductId(productId);
  }

  async getPromotionsByCategory(categoryId: string): Promise<Promotion[]> {
    return this.promotionRepository.findActiveByCategoryId(categoryId);
  }

  async getPromotionById(id: string): Promise<Promotion | null> {
    return this.promotionRepository.findById(id);
  }

  async createPromotion(promotion: Omit<PromotionInsert, 'store_id'>): Promise<Promotion> {
    // Validações
    if (!promotion.name || promotion.name.trim() === '') {
      throw new Error('Promotion name is required');
    }

    if (promotion.discount_value <= 0) {
      throw new Error('Discount value must be greater than 0');
    }

    if (promotion.discount_type === 'percentage' && promotion.discount_value > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    if (new Date(promotion.end_date) <= new Date(promotion.start_date)) {
      throw new Error('End date must be after start date');
    }

    // Validar seleções baseadas no tipo de promoção
    if (promotion.promotion_type === 'product') {
      const productIds = promotion.product_ids as string[] || [];
      if (productIds.length === 0) {
        throw new Error('At least one product must be selected for product promotions');
      }
    }

    if (promotion.promotion_type === 'category') {
      const categoryIds = promotion.category_ids as string[] || [];
      if (categoryIds.length === 0) {
        throw new Error('At least one category must be selected for category promotions');
      }
    }

    // Determinar status baseado nas datas se não foi fornecido
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);
    
    if (!promotion.status) {
      if (startDate > now) {
        promotion.status = 'scheduled';
      } else if (startDate <= now && endDate >= now) {
        promotion.status = 'active';
      } else {
        promotion.status = 'expired';
      }
    }

    return this.promotionRepository.create(promotion);
  }

  async updatePromotion(id: string, promotion: PromotionUpdate): Promise<Promotion> {
    const existing = await this.promotionRepository.findById(id);
    if (!existing) {
      throw new Error('Promotion not found');
    }

    return this.promotionRepository.update(id, promotion);
  }

  async deletePromotion(id: string): Promise<void> {
    const existing = await this.promotionRepository.findById(id);
    if (!existing) {
      throw new Error('Promotion not found');
    }

    return this.promotionRepository.delete(id);
  }

  calculatePromotionalPrice(originalPrice: number, discountType: string, discountValue: number): number {
    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else if (discountType === 'fixed_amount') {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  }

  calculateDiscountPercentage(originalPrice: number, promotionalPrice: number): number {
    return Math.round(((originalPrice - promotionalPrice) / originalPrice) * 100);
  }
}
