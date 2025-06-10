
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedCartSummary } from './EnhancedCartSummary';
import { SmartShippingCalculator } from './SmartShippingCalculator';
import { CartItem } from '@/contexts/CartContext';
import { ShippingCalculation } from '@/types/shipping';

interface CartStepProps {
  items: CartItem[];
  onShippingCalculated: (calculations: ShippingCalculation[]) => void;
  onShippingMethodSelected: (methodId: string, price: number) => void;
  onNext: () => void;
}

export function CartStep({ 
  items, 
  onShippingCalculated, 
  onShippingMethodSelected, 
  onNext 
}: CartStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Coluna 1: Calcular Frete (40%) */}
        <div className="lg:col-span-2">
          <SmartShippingCalculator
            items={items}
            onShippingCalculated={onShippingCalculated}
            onShippingMethodSelected={onShippingMethodSelected}
          />
        </div>
        
        {/* Coluna 2: Resumo do Carrinho (60%) */}
        <div className="lg:col-span-3">
          <EnhancedCartSummary 
            allowEditing={true}
            showShippingCalculator={false}
          />
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Link to="/">
          <Button variant="outline">Continuar Comprando</Button>
        </Link>
        <Button 
          onClick={onNext}
          disabled={items.length === 0}
        >
          Continuar para Identificação
        </Button>
      </div>
    </div>
  );
}
