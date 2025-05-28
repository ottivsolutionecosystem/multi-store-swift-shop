
import { Database } from '@/integrations/supabase/types';

type Promotion = Database['public']['Tables']['promotions']['Row'];

export function isPromotionActive(promotion: Promotion): boolean {
  if (!promotion.is_active) return false;
  
  const now = new Date();
  const startDate = new Date(promotion.start_date);
  const endDate = new Date(promotion.end_date);
  
  return now >= startDate && now <= endDate;
}

export function calculatePromotionalPrice(
  originalPrice: number, 
  discountType: string, 
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return originalPrice * (1 - discountValue / 100);
  } else if (discountType === 'fixed_amount') {
    return Math.max(0, originalPrice - discountValue);
  }
  return originalPrice;
}

export function calculateDiscountPercentage(originalPrice: number, promotionalPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - promotionalPrice) / originalPrice) * 100);
}

export function formatPromotionBadge(
  originalPrice: number, 
  promotionalPrice: number, 
  displayFormat: 'percentage' | 'comparison'
): string {
  if (displayFormat === 'percentage') {
    const percentage = calculateDiscountPercentage(originalPrice, promotionalPrice);
    return `${percentage}% ↓`;
  } else {
    return `De R$ ${originalPrice.toFixed(2)} por R$ ${promotionalPrice.toFixed(2)}`;
  }
}

export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2)}`;
}
