
import React from 'react';
import { Button } from '@/components/ui/button';

interface ShippingNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export function ShippingNavigation({ onPrevious, onNext, canProceed }: ShippingNavigationProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button variant="outline" onClick={onPrevious}>
        Voltar
      </Button>
      <Button 
        onClick={onNext} 
        disabled={!canProceed}
      >
        Continuar para Finalização
      </Button>
    </div>
  );
}
