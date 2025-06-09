
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { CheckoutState } from '@/types/checkout';

interface FinalStepProps {
  checkoutState: CheckoutState;
  onPrevious: () => void;
  onOrderComplete: () => void;
}

export function FinalStep({ checkoutState, onPrevious, onOrderComplete }: FinalStepProps) {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const services = useServices();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState(checkoutState.notes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalTotal = total + checkoutState.shipping_price;

  const handlePlaceOrder = async () => {
    if (!services) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        user_id: user?.id || 'guest',
        customer_name: user ? user.email : checkoutState.user?.full_name || '',
        customer_email: user ? user.email : checkoutState.user?.email || '',
        customer_phone: checkoutState.user?.phone || '',
        total_amount: finalTotal,
        shipping_cost: checkoutState.shipping_price,
        discount_amount: 0,
        status: 'pending' as const,
        shipping_address: checkoutState.delivery_address,
        notes: notes,
        payment_method: 'pending',
      };

      // Create order
      const order = await services.orderService.createOrder(orderData);

      // Add order items
      for (const item of items) {
        await services.orderService.addOrderItem(order.id, {
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.finalPrice,
        });
      }

      // Clear cart and complete checkout
      clearCart();
      
      toast({
        title: 'Pedido realizado com sucesso!',
        description: `Pedido #${order.id.slice(0, 8)} foi criado. Você receberá um email de confirmação.`,
      });

      onOrderComplete();
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Erro ao processar pedido',
        description: 'Ocorreu um erro ao processar seu pedido. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Info */}
          <div>
            <h4 className="font-medium mb-2">Dados do Cliente</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Nome: {user ? user.email : checkoutState.user?.full_name}</p>
              <p>Email: {user ? user.email : checkoutState.user?.email}</p>
              {checkoutState.user?.phone && (
                <p>Telefone: {checkoutState.user.phone}</p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          {checkoutState.delivery_address && (
            <div>
              <h4 className="font-medium mb-2">Endereço de Entrega</h4>
              <div className="text-sm text-gray-600">
                <p>{checkoutState.delivery_address.street}, {checkoutState.delivery_address.number}</p>
                {checkoutState.delivery_address.complement && (
                  <p>{checkoutState.delivery_address.complement}</p>
                )}
                <p>{checkoutState.delivery_address.neighborhood}</p>
                <p>{checkoutState.delivery_address.city} - {checkoutState.delivery_address.state}</p>
                <p>CEP: {checkoutState.delivery_address.zip_code}</p>
              </div>
            </div>
          )}

          {/* Products */}
          <div>
            <h4 className="font-medium mb-2">Produtos</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{(item.finalPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete:</span>
              <span className={checkoutState.shipping_price === 0 ? 'text-green-600' : ''}>
                {checkoutState.shipping_price === 0 
                  ? 'Grátis' 
                  : checkoutState.shipping_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                }
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Observações do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Instruções especiais para entrega, informações adicionais..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          Voltar
        </Button>
        <Button 
          onClick={handlePlaceOrder} 
          disabled={isSubmitting}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
        </Button>
      </div>
    </div>
  );
}
