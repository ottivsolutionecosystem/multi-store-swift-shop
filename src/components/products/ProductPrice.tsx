
import React from 'react';
import { ProductWithPromotion } from '@/types/product';
import { formatPrice } from '@/lib/promotionUtils';
import { useTenant } from '@/contexts/TenantContext';

interface ProductPriceProps {
  product: ProductWithPromotion;
}

export function ProductPrice({ product }: ProductPriceProps) {
  const { store } = useTenant();
  
  const showPrice = store?.store_settings?.show_price ?? true;
  const promotionDisplayFormat = store?.store_settings?.promotion_display_format || 'percentage';
  const priceColor = store?.store_settings?.price_color || '#16a34a';

  if (!showPrice) return null;

  const hasPromotion = Boolean(product.promotion);
  
  // Lógica para preços baseada no tipo de promoção
  let displayPrice: number;
  let originalPrice: number;
  let savings: number = 0;
  
  if (hasPromotion && product.promotion) {
    if (product.promotion.compare_at_price) {
      // Caso: Preço Comparativo
      displayPrice = product.price; // Preço atual (promocional)
      originalPrice = product.promotion.compare_at_price; // Preço "de"
      savings = originalPrice - displayPrice;
    } else {
      // Caso: Promoção ativa (global, categoria, produto)
      displayPrice = product.promotion.promotional_price;
      originalPrice = product.price;
      savings = originalPrice - displayPrice;
    }
  } else {
    // Caso: Sem promoção
    displayPrice = product.price;
    originalPrice = product.price;
  }

  return (
    <div className="flex flex-col">
      {hasPromotion && savings > 0 ? (
        <>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
          <span 
            className="text-2xl font-bold"
            style={{ color: priceColor }}
          >
            {formatPrice(displayPrice)}
          </span>
          {promotionDisplayFormat === 'comparison' && (
            <span className="text-xs text-red-500 font-medium">
              Economia: {formatPrice(savings)}
            </span>
          )}
        </>
      ) : (
        <span 
          className="text-2xl font-bold"
          style={{ color: priceColor }}
        >
          {formatPrice(displayPrice)}
        </span>
      )}
    </div>
  );
}
