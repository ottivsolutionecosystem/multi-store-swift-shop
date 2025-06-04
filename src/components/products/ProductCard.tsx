
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Package } from 'lucide-react';
import { ProductWithPromotion } from '@/repositories/ProductRepository';
import { formatPrice } from '@/lib/promotionUtils';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { 
  getPromotionBadgeClassName, 
  formatPromotionBadgeText 
} from '@/lib/promotionBadgeUtils';

interface ProductCardProps {
  product: ProductWithPromotion;
  onAddToCart?: (product: ProductWithPromotion) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { storeSettings } = useStoreSettings();
  
  // Use configurações da loja ou padrões
  const showCategory = storeSettings?.show_category ?? true;
  const showDescription = storeSettings?.show_description ?? true;
  const showStockQuantity = storeSettings?.show_stock_quantity ?? true;
  const showPrice = storeSettings?.show_price ?? true;
  const showPromotionBadge = storeSettings?.show_promotion_badge ?? true;
  const promotionDisplayFormat = storeSettings?.promotion_display_format || 'percentage';
  const priceColor = storeSettings?.price_color || '#16a34a';

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

  const renderCategoryBreadcrumb = () => {
    if (!showCategory || !product.category) {
      return null;
    }

    return (
      <Breadcrumb>
        <BreadcrumbList className="text-xs leading-none">
          {product.category.parent_category ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-gray-500 hover:text-gray-700">
                  {product.category.parent_category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-600">
                  {product.category.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-600">
                {product.category.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  const handleAddToCartClick = () => {
    // Usar o preço de exibição correto para o carrinho
    const productForCart = {
      ...product,
      finalPrice: displayPrice,
    };
    
    onAddToCart?.(productForCart);
  };

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
          {hasPromotion && showPromotionBadge && product.promotion && (
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
          )}
        </div>
        <div className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          {renderCategoryBreadcrumb()}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-4 pb-2">
        {showDescription && product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          {showPrice && (
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
          )}
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
