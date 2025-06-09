
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/ProductImage';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartSummary() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Carrinho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-md">
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
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-2 text-sm">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock_quantity}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.product.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Subtotal:</span>
            <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
