
export type ViewMode = 'table' | 'list';

export type SortField = 'name' | 'price' | 'created_at' | 'stock_quantity' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface ProductFilters {
  search: string;
  categoryId?: string;
  status: 'all' | 'active' | 'inactive';
  stock: 'all' | 'in_stock' | 'out_of_stock';
}

export interface ProductSort {
  field: SortField;
  direction: SortDirection;
}

export interface ProductManagementState {
  viewMode: ViewMode;
  filters: ProductFilters;
  sort: ProductSort;
}
