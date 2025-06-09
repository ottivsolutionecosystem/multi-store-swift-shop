
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { EmptyCartState } from '@/components/cart/EmptyCartState';
import { CartItemsList } from '@/components/cart/CartItemsList';
import { CartShippingCalculator } from '@/components/cart/CartShippingCalculator';
import { CartOrderSummary } from '@/components/cart/CartOrderSummary';
import { ShippingCalculation } from '@/types/shipping';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const services = useServices();
  const { toast } = useToast();

  const [cep, setCep] = useState('');
  const [shippingCalculations, setShippingCalculations] = useState<ShippingCalculation[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const calculateShipping = async () => {
    if (!services || !cep.trim()) {
      toast({
        title: 'CEP necessário',
        description: 'Digite o CEP para calcular o frete',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho para calcular o frete',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCalculatingShipping(true);
      const calculations = await services.shippingService.calculateShipping(items, cep);
      setShippingCalculations(calculations);
      
      // Auto-select the first available method
      if (calculations.length > 0) {
        setSelectedShippingMethod(calculations[0].method_id);
        setShippingPrice(calculations[0].price);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao calcular frete',
        variant: 'destructive',
      });
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleShippingMethodSelect = (methodId: string, price: number) => {
    setSelectedShippingMethod(methodId);
    setShippingPrice(price);
  };

  const formatCep = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Apply mask: 00000-000
    if (cleaned.length <= 5) {
      return cleaned;
    } else {
      return cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
  };

  const finalTotal = total + shippingPrice;

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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Carrinho de Compras</h1>
          <Button variant="outline" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Carrinho
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartItemsList
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />

          {/* Cart Summary and Shipping */}
          <div className="lg:col-span-1 space-y-6">
            <CartShippingCalculator
              onCalculateShipping={calculateShipping}
              calculating={calculatingShipping}
              cep={cep}
              onCepChange={handleCepChange}
            />

            {/* Shipping Methods */}
            {shippingCalculations.length > 0 && (
              <ShippingMethodSelector
                calculations={shippingCalculations}
                selectedMethodId={selectedShippingMethod}
                onMethodSelect={handleShippingMethodSelect}
                loading={calculatingShipping}
              />
            )}

            <CartOrderSummary
              subtotal={total}
              shippingPrice={shippingPrice}
              total={finalTotal}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
