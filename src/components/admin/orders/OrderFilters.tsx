
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { OrderFilters as OrderFiltersType } from '@/types/order-management';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFiltersChange: (filters: OrderFiltersType) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Processando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function OrderFilters({ filters, onFiltersChange, onReset }: OrderFiltersProps) {
  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof OrderFiltersType];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined);
    }
    return value !== undefined && value !== '';
  }).length;

  const handleStatusChange = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const removeStatus = (status: string) => {
    const newStatuses = (filters.status || []).filter(s => s !== status);
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-2" />
            Limpar ({activeFiltersCount})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="space-y-2">
          <Label>Buscar</Label>
          <Input
            placeholder="Cliente, pedido..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              search: e.target.value || undefined,
            })}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valor mínimo */}
        <div className="space-y-2">
          <Label>Valor mínimo</Label>
          <Input
            type="number"
            placeholder="R$ 0,00"
            value={filters.minAmount || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              minAmount: e.target.value ? Number(e.target.value) : undefined,
            })}
          />
        </div>

        {/* Valor máximo */}
        <div className="space-y-2">
          <Label>Valor máximo</Label>
          <Input
            type="number"
            placeholder="R$ 1000,00"
            value={filters.maxAmount || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              maxAmount: e.target.value ? Number(e.target.value) : undefined,
            })}
          />
        </div>
      </div>

      {/* Status selecionados */}
      {filters.status && filters.status.length > 0 && (
        <div className="space-y-2">
          <Label>Status selecionados:</Label>
          <div className="flex flex-wrap gap-2">
            {filters.status.map((status) => {
              const statusLabel = statusOptions.find(s => s.value === status)?.label || status;
              return (
                <Badge key={status} variant="secondary" className="cursor-pointer">
                  {statusLabel}
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={() => removeStatus(status)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
