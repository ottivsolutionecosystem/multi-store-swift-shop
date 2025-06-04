
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Package } from 'lucide-react';
import { ProductWithPromotion } from '@/repositories/ProductRepository';
import { formatPrice } from '@/lib/promotionUtils';
import { useStoreSettings } from '@/hooks/useStoreSettings';

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
  const displayPrice = hasPromotion ? product.promotion!.promotional_price : product.price;
  const originalPrice = product.price;

  const getPromotionBadgeVariant = (promotionType: string) => {
    switch (promotionType) {
      case 'global':
        return 'destructive'; // Vermelho
      case 'category':
        return 'secondary'; // Cinza/Laranja
      case 'product':
        return 'default'; // Azul
      default:
        return 'outline'; // Verde para preço comparativo
    }
  };

  const getPromotionBadgeText = () => {
    if (!product.promotion) return '';

    const { promotion_type, name } = product.promotion;
    
    if (promotionDisplayFormat === 'percentage') {
      const percentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
      let typeLabel = '';
      
      switch (promotion_type) {
        case 'global':
          typeLabel = 'GLOBAL';
          break;
        case 'category':
          typeLabel = 'CATEGORIA';
          break;
        case 'product':
          typeLabel = 'PRODUTO';
          break;
        default:
          typeLabel = 'OFERTA';
      }
      
      return `${typeLabel} ${percentage}% ↓`;
    } else {
      // Para formato de comparação, usar o nome da promoção ou tipo
      return name || promotion_type?.toUpperCase() || 'PROMOÇÃO';
    }
  };

  const getPromotionBadgeClassName = (promotionType: string) => {
    switch (promotionType) {
      case 'global':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'category':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'product':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      default:
        return 'bg-green-500 text-white hover:bg-green-600';
    }
  };

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
    // Usar o preço correto baseado na hierarquia de promoções
    const finalPrice = hasPromotion ? product.promotion!.promotional_price : product.price;
    
    // Criar uma versão do produto com o preço final para o carrinho
    const productForCart = {
      ...product,
      finalPrice, // Adicionar preço final calculado
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
          {hasPromotion && showPromotionBadge && (
            <div className="absolute top-2 left-2">
              <Badge 
                className={getPromotionBadgeClassName(product.promotion!.promotion_type)}
              >
                {getPromotionBadgeText()}
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
              {hasPromotion ? (
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
                      Economia: {formatPrice(originalPrice - displayPrice)}
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
