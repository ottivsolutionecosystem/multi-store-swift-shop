
import React from 'react';
import { CartItemCard } from './CartItemCard';
import { CartItem } from '@/contexts/CartContext';

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItemsList({ items, onUpdateQuantity, onRemoveItem }: CartItemsListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item.product.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}
