
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CartTotalsProps {
  total: number;
}

export function CartTotals({ total }: CartTotalsProps) {
  const navigate = useNavigate();

  return (
    <div className="pt-6 border-t">
      <div className="flex justify-between text-2xl font-bold mb-6">
        <span>Total:</span>
        <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
          Continuar Comprando
        </Button>
        <Button onClick={() => navigate('/checkout')} className="flex-1">
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
}
