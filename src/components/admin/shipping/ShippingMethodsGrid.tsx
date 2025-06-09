
import React from 'react';
import { ShippingMethodCard } from './ShippingMethodCard';
import { ShippingMethod } from '@/types/shipping';

interface ShippingMethodsGridProps {
  shippingMethods: ShippingMethod[];
  onEdit: (method: ShippingMethod) => void;
  onDelete: (id: string) => void;
}

export function ShippingMethodsGrid({ shippingMethods, onEdit, onDelete }: ShippingMethodsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shippingMethods.map((method) => (
        <ShippingMethodCard
          key={method.id}
          shippingMethod={method}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
