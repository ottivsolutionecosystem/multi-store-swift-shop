
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductWithPromotion } from '@/types/product';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { 
  getPromotionBadgeClassName, 
  formatPromotionBadgeText 
} from '@/lib/promotionBadgeUtils';

interface ProductPromotionBadgeProps {
  product: ProductWithPromotion;
}

export function ProductPromotionBadge({ product }: ProductPromotionBadgeProps) {
  const { storeSettings } = useStoreSettings();
  const showPromotionBadge = storeSettings?.show_promotion_badge ?? true;
  const promotionDisplayFormat = storeSettings?.promotion_display_format || 'percentage';

  const hasPromotion = Boolean(product.promotion);

  if (!hasPromotion || !showPromotionBadge || !product.promotion) {
    return null;
  }

  // Calcular preços para o badge
  let originalPrice: number;
  let displayPrice: number;
  
  if (product.promotion.compare_at_price) {
    // Caso: Preço Comparativo
    displayPrice = product.price;
    originalPrice = product.promotion.compare_at_price;
  } else {
    // Caso: Promoção ativa
    displayPrice = product.promotion.promotional_price;
    originalPrice = product.price;
  }

  return (
    <div className="absolute top-2 left-2">
      <Badge 
        className={getPromotionBadgeClassName(product.promotion.promotion_type)}
      >
        {formatPromotionBadgeText(
          product.promotion.promotion_type,
          product.promotion.name,
          originalPrice,
          displayPrice,
          promotionDisplayFormat
        )}
      </Badge>
    </div>
  );
}
