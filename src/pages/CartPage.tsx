
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { EmptyCartState } from '@/components/cart/EmptyCartState';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartTotals } from '@/components/cart/CartTotals';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <EmptyCartState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrinho de Compras</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Produtos no Carrinho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
            
            <CartTotals total={total} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
