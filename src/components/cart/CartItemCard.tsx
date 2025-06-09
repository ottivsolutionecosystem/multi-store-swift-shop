
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/ProductImage';
import { CartItem } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemoveItem }: CartItemCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-md">
      <div className="w-20 h-20 flex-shrink-0">
        <ProductImage 
          imageUrl={item.product.image_url} 
          name={item.product.name}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-lg line-clamp-2">{item.product.name}</h3>
        <p className="text-lg text-primary font-semibold">
          {item.finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-10 w-10 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 text-lg">{item.quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            disabled={item.quantity >= item.product.stock_quantity}
            className="h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveItem(item.product.id)}
          className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
