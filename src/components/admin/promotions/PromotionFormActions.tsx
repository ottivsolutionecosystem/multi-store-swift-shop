
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PromotionFormActionsProps {
  isLoading: boolean;
  promotionId?: string;
  onCancel: () => void;
}

export function PromotionFormActions({ isLoading, promotionId, onCancel }: PromotionFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {promotionId ? 'Atualizar Promoção' : 'Criar Promoção'}
      </Button>
    </div>
  );
}
