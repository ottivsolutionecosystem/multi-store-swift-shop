
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductSort, SortField, SortDirection } from '@/types/product-management';

interface ProductSortProps {
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'name', label: 'Nome' },
  { value: 'price', label: 'Preço' },
  { value: 'created_at', label: 'Data de criação' },
  { value: 'stock_quantity', label: 'Estoque' },
  { value: 'category', label: 'Categoria' },
];

export function ProductSortComponent({ sort, onSortChange }: ProductSortProps) {
  const handleFieldChange = (field: SortField) => {
    onSortChange({ ...sort, field });
  };

  const toggleDirection = () => {
    const newDirection: SortDirection = sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ ...sort, direction: newDirection });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Ordenar por:</span>
      <Select value={sort.field} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={toggleDirection} className="flex items-center gap-1">
        {sort.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
        {sort.direction === 'asc' ? 'Crescente' : 'Decrescente'}
      </Button>
    </div>
  );
}
