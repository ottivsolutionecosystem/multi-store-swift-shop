
import { useState, useMemo } from 'react';
import { Database } from '@/integrations/supabase/types';
import { PromotionFilters, PromotionSort, PromotionViewMode } from '@/types/promotion-management';

type Promotion = Database['public']['Tables']['promotions']['Row'];

export function usePromotionManagement(promotions: Promotion[]) {
  const [viewMode, setViewMode] = useState<PromotionViewMode>('list');
  const [filters, setFilters] = useState<PromotionFilters>({
    search: '',
    status: 'all',
    promotionType: 'all',
    discountType: 'all',
    period: 'all',
  });
  const [sort, setSort] = useState<PromotionSort>({
    field: 'created_at',
    direction: 'desc',
  });

  const filteredPromotions = useMemo(() => {
    const now = new Date();
    
    return promotions.filter((promotion) => {
      // Search filter
      if (filters.search && !promotion.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Status filter - agora usa o campo status diretamente
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
  }, [promotions, filters]);

  const sortedPromotions = useMemo(() => {
    return [...filteredPromotions].sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      // Handle date fields
      if (sort.field === 'start_date' || sort.field === 'end_date' || sort.field === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle numeric fields
      if (sort.field === 'discount_value') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      // Handle string fields
      if (sort.field === 'name' || sort.field === 'status') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPromotions, sort]);

  return {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    sort,
    setSort,
    filteredPromotions: sortedPromotions,
    totalPromotions: promotions.length,
    filteredCount: sortedPromotions.length,
  };
}
