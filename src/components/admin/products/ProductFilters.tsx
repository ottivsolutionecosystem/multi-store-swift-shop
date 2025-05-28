
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ProductFilters } from '@/types/product-management';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Array<{ id: string; name: string }>;
}

export function ProductFiltersComponent({ filters, onFiltersChange, categories }: ProductFiltersProps) {
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      stock: 'all',
      categoryId: undefined,
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.stock !== 'all' || filters.categoryId;

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={filters.categoryId || 'all'} onValueChange={(value) => handleFilterChange('categoryId', value === 'all' ? undefined : value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="inactive">Inativos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.stock} onValueChange={(value) => handleFilterChange('stock', value)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo estoque</SelectItem>
          <SelectItem value="in_stock">Com estoque</SelectItem>
          <SelectItem value="out_of_stock">Sem estoque</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
