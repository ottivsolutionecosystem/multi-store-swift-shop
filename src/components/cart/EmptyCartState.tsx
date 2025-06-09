
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function EmptyCartState() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
      <p className="text-gray-600 mb-8">Adicione produtos ao carrinho para continuar</p>
      <Button onClick={() => navigate('/')}>
        Continuar Comprando
      </Button>
    </div>
  );
}
