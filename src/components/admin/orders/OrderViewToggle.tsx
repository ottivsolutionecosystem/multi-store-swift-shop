
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, Grid3X3 } from 'lucide-react';
import { OrderViewMode } from '@/types/order-management';

interface OrderViewToggleProps {
  viewMode: OrderViewMode;
  onViewModeChange: (mode: OrderViewMode) => void;
}

export function OrderViewToggle({ viewMode, onViewModeChange }: OrderViewToggleProps) {
  return (
    <div className="flex items-center border rounded-lg">
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="rounded-r-none border-0"
      >
        <Grid3X3 className="h-4 w-4 mr-2" />
        Lista
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="rounded-l-none border-l border-gray-200"
      >
        <Table className="h-4 w-4 mr-2" />
        Tabela
      </Button>
    </div>
  );
}
