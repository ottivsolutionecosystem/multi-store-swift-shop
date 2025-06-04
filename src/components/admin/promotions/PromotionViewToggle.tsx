
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, Grid3X3 } from 'lucide-react';
import { PromotionViewMode } from '@/types/promotion-management';

interface PromotionViewToggleProps {
  viewMode: PromotionViewMode;
  onViewModeChange: (mode: PromotionViewMode) => void;
}

export function PromotionViewToggle({ viewMode, onViewModeChange }: PromotionViewToggleProps) {
  return (
    <div className="flex border rounded-lg p-1 bg-gray-50">
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="flex items-center gap-2"
      >
        <Table className="h-4 w-4" />
        Tabela
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="flex items-center gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        Lista
      </Button>
    </div>
  );
}
