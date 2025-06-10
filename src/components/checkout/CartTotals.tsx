
import React from 'react';

interface CartTotalsProps {
  subtotal: number;
  shippingPrice: number;
}

export function CartTotals({ subtotal, shippingPrice }: CartTotalsProps) {
  const finalTotal = subtotal + shippingPrice;

  return (
    <div className="pt-4 border-t space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      
      {shippingPrice > 0 && (
        <div className="flex justify-between">
          <span>Frete:</span>
          <span>{shippingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      )}
      
      <div className="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>{finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
    </div>
  );
}
