
export type PromotionViewMode = 'table' | 'list';

export interface PromotionFilters {
  search: string;
  status: 'all' | 'active' | 'scheduled' | 'expired' | 'inactive';
  promotionType: 'all' | 'product' | 'category' | 'global';
  discountType: 'all' | 'percentage' | 'fixed_amount';
  period: 'all' | 'current' | 'upcoming' | 'past';
}

export interface PromotionSort {
  field: 'name' | 'start_date' | 'end_date' | 'discount_value' | 'created_at';
  direction: 'asc' | 'desc';
}
