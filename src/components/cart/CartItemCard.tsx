
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            <ProductImage 
              imageUrl={item.product.image_url} 
              name={item.product.name}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
            <p className="text-lg font-bold text-primary mt-1">
              {item.finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock_quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.product.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-right">
          <p className="text-sm text-gray-600">
            Subtotal: {(item.finalPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
