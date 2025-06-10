
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/ProductImage';
import { CartItem } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemDisplayProps {
  item: CartItem;
  allowEditing: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItemDisplay({ 
  item, 
  allowEditing, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartItemDisplayProps) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-md">
      <div className="w-16 h-16 flex-shrink-0">
        <ProductImage 
          imageUrl={item.product.image_url} 
          name={item.product.name}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
        <p className="text-sm text-primary font-semibold">
          {item.finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>
      
      {allowEditing && (
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2 text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock_quantity}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveItem(item.product.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {!allowEditing && (
        <div className="text-sm text-gray-600">
          Qtd: {item.quantity}
        </div>
      )}
    </div>
  );
}
