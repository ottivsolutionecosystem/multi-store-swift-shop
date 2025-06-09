
import React from 'react';
import { ShippingMethodCard } from './ShippingMethodCard';
import { ShippingMethod } from '@/types/shipping';

interface ShippingMethodsGridProps {
  methods: ShippingMethod[];
  onEdit: (method: ShippingMethod) => void;
  onDelete: (id: string) => void;
}

export function ShippingMethodsGrid({ methods, onEdit, onDelete }: ShippingMethodsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {methods.map((method) => (
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
