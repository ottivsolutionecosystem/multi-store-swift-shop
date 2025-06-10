
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ShippingCalculatorActionsProps {
  shouldShowCalculateButton: boolean;
  calculatingShipping: boolean;
  cep: string;
  onCalculateShipping: () => void;
}

export function ShippingCalculatorActions({
  shouldShowCalculateButton,
  calculatingShipping,
  cep,
  onCalculateShipping
}: ShippingCalculatorActionsProps) {
  if (shouldShowCalculateButton) {
    return (
      <Button 
        onClick={onCalculateShipping}
        disabled={!cep.trim() || calculatingShipping}
        className="w-full"
      >
        {calculatingShipping ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Frete'
        )}
      </Button>
    );
  }

  if (calculatingShipping) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <span className="text-sm text-muted-foreground">Calculando frete...</span>
      </div>
    );
  }

  return null;
}
