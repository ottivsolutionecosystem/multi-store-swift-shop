
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductWithPromotion } from '@/types/product';
import { useTenant } from '@/contexts/TenantContext';
import { 
  getPromotionBadgeClassName, 
  formatPromotionBadgeText 
} from '@/lib/promotionBadgeUtils';
import { Database } from '@/integrations/supabase/types';

type DiscountType = Database['public']['Enums']['discount_type'];

interface ProductPromotionBadgeProps {
  product: ProductWithPromotion;
}

export function ProductPromotionBadge({ product }: ProductPromotionBadgeProps) {
  const { store } = useTenant();
  const showPromotionBadge = store?.store_settings?.show_promotion_badge ?? true;

  const hasPromotion = Boolean(product.promotion);

  // Não exibir se não há promoção ou se a flag está desabilitada
  if (!hasPromotion || !showPromotionBadge || !product.promotion) {
    return null;
  }

  // Calcular preços para o badge
  let originalPrice: number;
  let promotionalPrice: number;
  
  if (product.promotion.compare_at_price) {
    // Caso: Preço Comparativo
    promotionalPrice = product.price;
    originalPrice = product.promotion.compare_at_price;
  } else {
    // Caso: Promoção ativa
    promotionalPrice = product.promotion.promotional_price;
    originalPrice = product.price;
  }

  return (
    <div className="absolute top-2 left-2">
      <Badge 
        className={getPromotionBadgeClassName(product.promotion.promotion_type)}
      >
        {formatPromotionBadgeText(
          product.promotion.discount_type as DiscountType,
          originalPrice,
          promotionalPrice
        )}
      </Badge>
    </div>
  );
}
