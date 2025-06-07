
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { OrderSort as OrderSortType } from '@/types/order-management';

interface OrderSortProps {
  sort: OrderSortType;
  onSortChange: (sort: OrderSortType) => void;
}

const sortOptions = [
  { value: 'created_at', label: 'Data de criação' },
  { value: 'total_amount', label: 'Valor total' },
  { value: 'status', label: 'Status' },
  { value: 'customer_name', label: 'Cliente' },
];

export function OrderSort({ sort, onSortChange }: OrderSortProps) {
  const handleFieldChange = (field: string) => {
    onSortChange({
      ...sort,
      field: field as OrderSortType['field'],
    });
  };

  const handleDirectionToggle = () => {
    onSortChange({
      ...sort,
      direction: sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="flex items-center gap-2">
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
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDirectionToggle}
        className="px-3"
      >
        <ArrowUpDown className="h-4 w-4" />
        {sort.direction === 'asc' ? 'Crescente' : 'Decrescente'}
      </Button>
    </div>
  );
}
