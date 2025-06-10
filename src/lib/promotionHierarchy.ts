
import { Database } from '@/integrations/supabase/types';
import { PromotionWithPriority } from '@/types/promotion';

type Promotion = Database['public']['Tables']['promotions']['Row'];

export function calculateBestPromotion(
  originalPrice: number,
  compareAtPrice: number | null,
  productPromotions: Promotion[],
  categoryPromotions: Promotion[],
  globalPromotions: Promotion[]
): PromotionWithPriority | null {
  console.log('🎯 calculateBestPromotion - Starting calculation', {
    originalPrice,
    compareAtPrice,
    productPromotions: productPromotions?.length || 0,
    categoryPromotions: categoryPromotions?.length || 0,
    globalPromotions: globalPromotions?.length || 0
  });

  // Validações de entrada para evitar undefined
  if (typeof originalPrice !== 'number' || originalPrice <= 0) {
    console.warn('🎯 calculateBestPromotion - Invalid originalPrice:', originalPrice);
    return null;
  }

  // Garantir que os arrays de promoções existam
  const safeProductPromotions = Array.isArray(productPromotions) ? productPromotions : [];
  const safeCategoryPromotions = Array.isArray(categoryPromotions) ? categoryPromotions : [];
  const safeGlobalPromotions = Array.isArray(globalPromotions) ? globalPromotions : [];

  const now = new Date();

  // Função para filtrar promoções ativas
  const getActivePromotions = (promotions: Promotion[]) => {
    if (!Array.isArray(promotions)) return [];
    
    return promotions.filter(promo => {
      if (!promo || !promo.is_active) return false;
      
      try {
        const startDate = new Date(promo.start_date);
        const endDate = new Date(promo.end_date);
        return now >= startDate && now <= endDate;
      } catch (error) {
        console.warn('🎯 calculateBestPromotion - Invalid date in promotion:', promo.id);
        return false;
      }
    });
  };

  // Função para calcular preço promocional
  const calculatePromotionalPrice = (price: number, discountType: string, discountValue: number) => {
    if (typeof price !== 'number' || typeof discountValue !== 'number') {
      console.warn('🎯 calculateBestPromotion - Invalid price calculation params:', { price, discountType, discountValue });
      return price;
    }

    if (discountType === 'percentage') {
      return price * (1 - discountValue / 100);
    } else if (discountType === 'fixed_amount') {
      return Math.max(0, price - discountValue);
    }
    return price;
  };

  // Função para encontrar a melhor promoção por prioridade
  const getBestPromotion = (promotions: Promotion[], type: 'global' | 'category' | 'product') => {
    const active = getActivePromotions(promotions);
    if (active.length === 0) return null;

    // Ordenar por prioridade (maior primeiro)
    const sorted = active.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const best = sorted[0];

    if (!best) return null;

    try {
      const promotionalPrice = calculatePromotionalPrice(
        originalPrice,
        best.discount_type,
        Number(best.discount_value) || 0
      );

      return {
        id: best.id,
        name: best.name,
        discount_type: best.discount_type,
        discount_value: Number(best.discount_value) || 0,
        promotional_price: promotionalPrice,
        promotion_type: type,
        priority: best.priority || 0,
        compare_at_price: null
      };
    } catch (error) {
      console.error('🎯 calculateBestPromotion - Error creating promotion object:', error);
      return null;
    }
  };

  // Hierarquia: Global > Categoria > Produto Específico
  
  // 1. Verificar promoções globais
  const globalPromotion = getBestPromotion(safeGlobalPromotions, 'global');
  if (globalPromotion) {
    console.log('🎯 calculateBestPromotion - Found global promotion:', globalPromotion.name);
    return globalPromotion;
  }

  // 2. Verificar promoções de categoria
  const categoryPromotion = getBestPromotion(safeCategoryPromotions, 'category');
  if (categoryPromotion) {
    console.log('🎯 calculateBestPromotion - Found category promotion:', categoryPromotion.name);
    return categoryPromotion;
  }

  // 3. Verificar promoções de produto específico
  const productPromotion = getBestPromotion(safeProductPromotions, 'product');
  if (productPromotion) {
    console.log('🎯 calculateBestPromotion - Found product promotion:', productPromotion.name);
    return productPromotion;
  }

  // 4. Se não há promoções ativas, verificar preço comparativo
  if (compareAtPrice && typeof compareAtPrice === 'number' && compareAtPrice > originalPrice) {
    console.log('🎯 calculateBestPromotion - Found compare-at-price promotion');
    return {
      id: 'compare-at-price',
      name: 'Preço Promocional',
      discount_type: 'fixed_amount',
      discount_value: compareAtPrice - originalPrice,
      promotional_price: originalPrice, // O preço atual é o preço promocional
      promotion_type: 'product',
      priority: -1,
      compare_at_price: compareAtPrice // Armazenar o preço comparativo original
    };
  }

  console.log('🎯 calculateBestPromotion - No promotion found');
  return null;
}
