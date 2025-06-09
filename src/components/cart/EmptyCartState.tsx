
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function EmptyCartState() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
      <p className="text-gray-600 mb-8">Adicione alguns produtos para continuar</p>
      <Link to="/">
        <Button>Continuar Comprando</Button>
      </Link>
    </div>
  );
}
