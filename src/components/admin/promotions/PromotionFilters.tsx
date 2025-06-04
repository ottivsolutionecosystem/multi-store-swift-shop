
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Calendar, Tag, Percent } from 'lucide-react';
import { PromotionFilters } from '@/types/promotion-management';

interface PromotionFiltersProps {
  filters: PromotionFilters;
  onFiltersChange: (filters: PromotionFilters) => void;
  filteredCount: number;
  totalCount: number;
}

export function PromotionFiltersComponent({ 
  filters, 
  onFiltersChange, 
  filteredCount, 
  totalCount 
}: PromotionFiltersProps) {
  const handleFilterChange = (key: keyof PromotionFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      promotionType: 'all',
      discountType: 'all',
      period: 'all',
    });
  };

  const hasActiveFilters = filters.search || 
    filters.status !== 'all' || 
    filters.promotionType !== 'all' || 
    filters.discountType !== 'all' || 
    filters.period !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar promoções..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="scheduled">Agendadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
            <SelectItem value="inactive">Inativas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.promotionType} onValueChange={(value) => handleFilterChange('promotionType', value)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="product">Produto</SelectItem>
            <SelectItem value="category">Categoria</SelectItem>
            <SelectItem value="global">Global</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.discountType} onValueChange={(value) => handleFilterChange('discountType', value)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Desconto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os descontos</SelectItem>
            <SelectItem value="percentage">Percentual</SelectItem>
            <SelectItem value="fixed_amount">Valor Fixo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.period} onValueChange={(value) => handleFilterChange('period', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="current">Em andamento</SelectItem>
            <SelectItem value="upcoming">Futuras</SelectItem>
            <SelectItem value="past">Passadas</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {(hasActiveFilters || filteredCount !== totalCount) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Mostrando {filteredCount} de {totalCount} promoções
          </span>
          {hasActiveFilters && (
            <span className="text-blue-600">• Filtros aplicados</span>
          )}
        </div>
      )}
    </div>
  );
}
