
export function getPromotionBadgeVariant(promotionType: string) {
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
}

export function getPromotionBadgeClassName(promotionType: string) {
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
}

export function getPromotionTypeLabel(promotionType: string): string {
  switch (promotionType) {
    case 'global':
      return 'GLOBAL';
    case 'category':
      return 'CATEGORIA';
    case 'product':
      return 'PRODUTO';
    default:
      return 'OFERTA';
  }
}

export function formatPromotionBadgeText(
  promotionType: string,
  promotionName: string | undefined,
  originalPrice: number,
  displayPrice: number,
  displayFormat: 'percentage' | 'comparison'
): string {
  if (displayFormat === 'percentage') {
    const percentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    const typeLabel = getPromotionTypeLabel(promotionType);
    return `${typeLabel} ${percentage}% ↓`;
  } else {
    // Para formato de comparação, usar o nome da promoção ou tipo
    return promotionName || promotionType?.toUpperCase() || 'PROMOÇÃO';
  }
}
