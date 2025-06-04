
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Percent, Plus } from 'lucide-react';

interface PromotionEmptyStateProps {
  onCreatePromotion: () => void;
}

export function PromotionEmptyState({ onCreatePromotion }: PromotionEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Percent className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma promoção encontrada
        </h3>
        <p className="text-gray-600 mb-6">
          Comece criando sua primeira promoção para aumentar suas vendas
        </p>
        <Button onClick={onCreatePromotion} className="flex items-center gap-2 mx-auto">
          <Plus className="h-4 w-4" />
          Criar Primeira Promoção
        </Button>
      </CardContent>
    </Card>
  );
}
