
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
  const now = new Date();

  // Função para filtrar promoções ativas
  const getActivePromotions = (promotions: Promotion[]) => {
    return promotions.filter(promo => {
      if (!promo.is_active) return false;
      const startDate = new Date(promo.start_date);
      const endDate = new Date(promo.end_date);
      return now >= startDate && now <= endDate;
    });
  };

  // Função para calcular preço promocional
  const calculatePromotionalPrice = (price: number, discountType: string, discountValue: number) => {
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
    const sorted = active.sort((a, b) => b.priority - a.priority);
    const best = sorted[0];

    const promotionalPrice = calculatePromotionalPrice(
      originalPrice,
      best.discount_type,
      Number(best.discount_value)
    );

    return {
      id: best.id,
      name: best.name,
      discount_type: best.discount_type,
      discount_value: Number(best.discount_value),
      promotional_price: promotionalPrice,
      promotion_type: type,
      priority: best.priority
    };
  };

  // Hierarquia: Global > Categoria > Produto Específico
  
  // 1. Verificar promoções globais
  const globalPromotion = getBestPromotion(globalPromotions, 'global');
  if (globalPromotion) {
    return globalPromotion;
  }

  // 2. Verificar promoções de categoria
  const categoryPromotion = getBestPromotion(categoryPromotions, 'category');
  if (categoryPromotion) {
    return categoryPromotion;
  }

  // 3. Verificar promoções de produto específico
  const productPromotion = getBestPromotion(productPromotions, 'product');
  if (productPromotion) {
    return productPromotion;
  }

  // 4. Se não há promoções ativas, verificar preço comparativo
  if (compareAtPrice && compareAtPrice > originalPrice) {
    return {
      id: 'compare-at-price',
      name: 'Preço Promocional',
      discount_type: 'fixed_amount',
      discount_value: compareAtPrice - originalPrice,
      promotional_price: originalPrice,
      promotion_type: 'product',
      priority: -1
    };
  }

  return null;
}
