
import { Database } from '@/integrations/supabase/types';

type DiscountType = Database['public']['Enums']['discount_type'];

export function getPromotionBadgeClassName(promotionType: string): string {
  const baseClasses = "text-white text-xs font-bold px-2 py-1 rounded";
  
  switch (promotionType) {
    case 'product':
      return `${baseClasses} bg-red-500`;
    case 'category':
      return `${baseClasses} bg-orange-500`;
    case 'global':
      return `${baseClasses} bg-purple-500`;
    default:
      return `${baseClasses} bg-blue-500`;
  }
}

export function formatPromotionBadgeText(
  discountType: DiscountType,
  originalPrice: number,
  promotionalPrice: number
): string {
  if (discountType === 'percentage') {
    const percentage = Math.round(((originalPrice - promotionalPrice) / originalPrice) * 100);
    return `${percentage}% ↓`;
  } else {
    // fixed_amount
    const savings = originalPrice - promotionalPrice;
    return `R$ ${savings.toFixed(2)} ↓`;
  }
}
