
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { Package } from 'lucide-react';
import { ProductWithPromotion } from '@/repositories/ProductRepository';
import { formatPromotionBadge, formatPrice } from '@/lib/promotionUtils';

interface ProductCardProps {
  product: ProductWithPromotion;
  onAddToCart?: (product: ProductWithPromotion) => void;
  promotionDisplayFormat?: 'percentage' | 'comparison';
  showPromotionBadge?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart,
  promotionDisplayFormat = 'percentage',
  showPromotionBadge = true
}: ProductCardProps) {
  const hasPromotion = Boolean(product.promotion);
  const displayPrice = hasPromotion ? product.promotion!.promotional_price : product.price;
  const originalPrice = product.price;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Badge de promoção */}
          {hasPromotion && showPromotionBadge && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="bg-red-500 text-white">
                {promotionDisplayFormat === 'percentage' 
                  ? `${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% ↓`
                  : 'PROMOÇÃO'
                }
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-4 pb-2">
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasPromotion ? (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(displayPrice)}
                </span>
                {promotionDisplayFormat === 'comparison' && (
                  <span className="text-xs text-red-500 font-medium">
                    Economia: {formatPrice(originalPrice - displayPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(displayPrice)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            Estoque: {product.stock_quantity}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2">
        <Button 
          className="w-full" 
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </CardFooter>
    </Card>
  );
}
