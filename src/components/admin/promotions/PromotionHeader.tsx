
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PromotionHeaderProps {
  onCreatePromotion: () => void;
}

export function PromotionHeader({ onCreatePromotion }: PromotionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Promoções</h1>
        <p className="text-gray-600 mt-2">Crie e gerencie promoções para impulsionar suas vendas</p>
      </div>
      <Button onClick={onCreatePromotion} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nova Promoção
      </Button>
    </div>
  );
}
