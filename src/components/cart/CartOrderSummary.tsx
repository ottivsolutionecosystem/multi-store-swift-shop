
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CartOrderSummaryProps {
  subtotal: number;
  shippingPrice: number;
  total: number;
}

export function CartOrderSummary({ subtotal, shippingPrice, total }: CartOrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frete</span>
          <span className={shippingPrice === 0 ? 'text-green-600' : ''}>
            {shippingPrice === 0 
              ? 'Grátis' 
              : shippingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            }
          </span>
        </div>
        
        <hr />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        
        <Button className="w-full" size="lg">
          Finalizar Compra
        </Button>
        
        <Link to="/" className="block">
          <Button variant="outline" className="w-full">
            Continuar Comprando
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
