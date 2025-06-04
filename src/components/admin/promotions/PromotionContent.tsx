
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PromotionViewToggle } from './PromotionViewToggle';
import { PromotionListView } from './PromotionListView';
import { PromotionTableView } from './PromotionTableView';
import { PromotionViewMode, PromotionSort } from '@/types/promotion-management';
import { Database } from '@/integrations/supabase/types';

type Promotion = Database['public']['Tables']['promotions']['Row'];

interface PromotionContentProps {
  promotions: Promotion[];
  viewMode: PromotionViewMode;
  onViewModeChange: (mode: PromotionViewMode) => void;
  sort: PromotionSort;
  onSortChange: (sort: PromotionSort) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromotionContent({
  promotions,
  viewMode,
  onViewModeChange,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: PromotionContentProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suas Promoções</CardTitle>
            <CardDescription>
              Gerencie todas as suas promoções criadas
            </CardDescription>
          </div>
          <PromotionViewToggle
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'table' ? (
          <PromotionTableView
            promotions={promotions}
            sort={sort}
            onSortChange={onSortChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <PromotionListView
            promotions={promotions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
}
