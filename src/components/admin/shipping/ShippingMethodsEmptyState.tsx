
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck } from 'lucide-react';

interface ShippingMethodsEmptyStateProps {
  onCreateMethod: () => void;
}

export function ShippingMethodsEmptyState({ onCreateMethod }: ShippingMethodsEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum método de frete configurado
      </h2>
      <p className="text-gray-600 mb-6">
        Configure métodos de frete para oferecer opções de entrega aos seus clientes
      </p>
      <Button onClick={onCreateMethod}>
        <Plus className="h-4 w-4 mr-2" />
        Criar Primeiro Método
      </Button>
    </div>
  );
}
