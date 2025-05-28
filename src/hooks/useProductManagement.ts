
import { useState, useMemo } from 'react';
import { ProductWithPromotion } from '@/repositories/ProductRepository';
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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('product-view-mode', mode);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
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

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'stock_quantity':
          aValue = a.stock_quantity;
          bValue = b.stock_quantity;
          break;
        case 'category':
          aValue = a.category?.name || '';
          bValue = b.category?.name || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, filters, sort]);

  return {
    viewMode,
    setViewMode: handleViewModeChange,
    filters,
    setFilters,
    sort,
    setSort,
    filteredProducts: filteredAndSortedProducts,
  };
}
