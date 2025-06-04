
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductWithPromotion } from '@/types/product';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { ProductImage } from './ProductImage';
import { ProductPromotionBadge } from './ProductPromotionBadge';
import { ProductCategoryBreadcrumb } from './ProductCategoryBreadcrumb';
import { ProductPrice } from './ProductPrice';

interface ProductCardProps {
  product: ProductWithPromotion;
  onAddToCart?: (product: ProductWithPromotion & { finalPrice?: number }) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { storeSettings } = useStoreSettings();
  
  const showDescription = storeSettings?.show_description ?? true;
  const showStockQuantity = storeSettings?.show_stock_quantity ?? true;

  const handleAddToCartClick = () => {
    // Calcular o preço final correto para o carrinho
    let finalPrice: number;
    
    const hasPromotion = Boolean(product.promotion);
    
    if (hasPromotion && product.promotion) {
      if (product.promotion.compare_at_price) {
        // Caso: Preço Comparativo - usar o preço atual do produto
        finalPrice = product.price;
      } else {
        // Caso: Promoção ativa - usar o preço promocional
        finalPrice = product.promotion.promotional_price;
      }
    } else {
      // Caso: Sem promoção - usar preço normal
      finalPrice = product.price;
    }
    
    const productForCart = {
      ...product,
      finalPrice,
    };
    
    onAddToCart?.(productForCart);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative">
          <ProductImage imageUrl={product.image_url} name={product.name} />
          <ProductPromotionBadge product={product} />
        </div>
        <div className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <ProductCategoryBreadcrumb product={product} />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-4 pb-2">
        {showDescription && product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <ProductPrice product={product} />
          {showStockQuantity && (
            <span className="text-sm text-gray-500">
              Estoque: {product.stock_quantity}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2">
        <Button 
          className="w-full" 
          onClick={handleAddToCartClick}
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </CardFooter>
    </Card>
  );
}
