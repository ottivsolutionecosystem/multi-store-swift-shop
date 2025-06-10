
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from './ProductImage';
import { ProductPrice } from './ProductPrice';
import { ProductPromotionBadge } from './ProductPromotionBadge';
import { ProductCategoryBreadcrumb } from './ProductCategoryBreadcrumb';
import { ProductWithPromotion } from '@/types/product';
import { useStoreSettings } from '@/hooks/useStoreSettings';

interface ProductCardProps {
  product: ProductWithPromotion;
}

export function ProductCard({ product }: ProductCardProps) {
  const { storeSettings, isLoading: settingsLoading } = useStoreSettings();

  // Use fallback settings while loading or if settings are not available
  const settings = storeSettings || {
    show_category: true,
    show_description: true,
    show_stock_quantity: true,
    show_price: true,
    show_promotion_badge: true,
    promotion_display_format: 'percentage' as const,
    primary_color: '#3b82f6',
    secondary_color: '#6b7280',
    price_color: '#16a34a',
  };

  const hasPromotion = product.promotion && product.promotion.promotional_price < product.price;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative aspect-square">
        <ProductImage 
          imageUrl={product.image_url} 
          name={product.name}
        />
        {settings.show_promotion_badge && hasPromotion && (
          <div className="absolute top-2 right-2">
            <ProductPromotionBadge 
              product={product}
            />
          </div>
        )}
        {settings.show_stock_quantity && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-white/90 text-orange-600 border-orange-200">
              Últimas {product.stock_quantity} unidades
            </Badge>
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              Esgotado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {settings.show_category && product.category && (
          <ProductCategoryBreadcrumb product={product} />
        )}

        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {settings.show_description && product.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {settings.show_price && (
            <ProductPrice 
              product={product}
            />
          )}
          
          {!product.is_active && (
            <Badge variant="secondary">
              Inativo
            </Badge>
          )}
        </div>

        {settings.show_stock_quantity && (
          <div className="text-xs text-gray-500">
            {product.stock_quantity > 0 ? (
              `${product.stock_quantity} em estoque`
            ) : (
              'Fora de estoque'
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
