
import { useState, useMemo, useCallback } from 'react';
import { Database } from '@/integrations/supabase/types';
import { PromotionFilters, PromotionSort, PromotionViewMode } from '@/types/promotion-management';

type Promotion = Database['public']['Tables']['promotions']['Row'];

const defaultFilters: PromotionFilters = {
  search: '',
  status: 'all',
  promotionType: 'all',
  discountType: 'all',
  period: 'all',
};

const defaultSort: PromotionSort = {
  field: 'created_at',
  direction: 'desc',
};

export function usePromotionManagement(promotions: Promotion[]) {
  const [viewMode, setViewMode] = useState<PromotionViewMode>('list');
  const [filters, setFilters] = useState<PromotionFilters>(defaultFilters);
  const [sort, setSort] = useState<PromotionSort>(defaultSort);

  const handleFiltersChange = useCallback((newFilters: PromotionFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort: PromotionSort) => {
    setSort(newSort);
  }, []);

  const filteredAndSortedPromotions = useMemo(() => {
    if (!promotions.length) return [];

    const now = new Date();
    
    // Filter step
    let filtered = promotions.filter((promotion) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!promotion.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter - use status field directly
      if (filters.status !== 'all' && promotion.status !== filters.status) {
        return false;
      }

      // Promotion type filter
      if (filters.promotionType !== 'all' && promotion.promotion_type !== filters.promotionType) {
        return false;
      }

      // Discount type filter
      if (filters.discountType !== 'all' && promotion.discount_type !== filters.discountType) {
        return false;
      }

      // Period filter
      if (filters.period !== 'all') {
        const startDate = new Date(promotion.start_date);
        const endDate = new Date(promotion.end_date);
        
        switch (filters.period) {
          case 'current':
            if (startDate > now || endDate < now) return false;
            break;
          case 'upcoming':
            if (startDate <= now) return false;
            break;
          case 'past':
            if (endDate >= now) return false;
            break;
        }
      }

      return true;
    });

    // Sort step - optimized with type-specific comparisons
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'start_date':
        case 'end_date':
        case 'created_at':
          comparison = new Date(a[sort.field]).getTime() - new Date(b[sort.field]).getTime();
          break;
        case 'discount_value':
          comparison = Number(a.discount_value) - Number(b.discount_value);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          return 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [promotions, filters, sort]);

  return {
    viewMode,
    setViewMode,
    filters,
    setFilters: handleFiltersChange,
    sort,
    setSort: handleSortChange,
    filteredPromotions: filteredAndSortedPromotions,
    totalPromotions: promotions.length,
    filteredCount: filteredAndSortedPromotions.length,
  };
}
