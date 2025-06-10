
import { useState, useMemo, useCallback } from 'react';
import { ProductWithPromotion } from '@/types/product';
import { ProductFilters, ProductSort, ViewMode } from '@/types/product-management';

const defaultFilters: ProductFilters = {
  search: '',
  status: 'all',
  stock: 'all',
};

const defaultSort: ProductSort = {
  field: 'created_at',
  direction: 'desc',
};

export function useProductManagement(products: ProductWithPromotion[]) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('product-view-mode') as ViewMode) || 'table';
  });
  
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [sort, setSort] = useState<ProductSort>(defaultSort);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('product-view-mode', mode);
  }, []);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort: ProductSort) => {
    setSort(newSort);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products.length) return [];

    // Filter step
    let filtered = products.filter(product => {
      // Search filter - optimized with early return
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!product.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status === 'active' && !product.is_active) return false;
      if (filters.status === 'inactive' && product.is_active) return false;

      // Stock filter
      if (filters.stock === 'in_stock' && product.stock_quantity <= 0) return false;
      if (filters.stock === 'out_of_stock' && product.stock_quantity > 0) return false;

      // Category filter
      if (filters.categoryId && product.category_id !== filters.categoryId) return false;

      return true;
    });

    // Sort step - optimized with type-specific comparisons
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'stock_quantity':
          comparison = a.stock_quantity - b.stock_quantity;
          break;
        case 'category':
          const aCategory = a.category?.name || '';
          const bCategory = b.category?.name || '';
          comparison = aCategory.localeCompare(bCategory);
          break;
        default:
          return 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, filters, sort]);

  return {
    viewMode,
    setViewMode: handleViewModeChange,
    filters,
    setFilters: handleFiltersChange,
    sort,
    setSort: handleSortChange,
    filteredProducts: filteredAndSortedProducts,
  };
}
