
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartShippingCalculator } from '@/components/cart/CartShippingCalculator';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { CartItemDisplay } from './CartItemDisplay';
import { CartTotals } from './CartTotals';
import { CartActions } from './CartActions';
import { useCart } from '@/contexts/CartContext';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingCalculation } from '@/types/shipping';

interface EnhancedCartSummaryProps {
  allowEditing?: boolean;
  showShippingCalculator?: boolean;
  onShippingCalculated?: (calculations: ShippingCalculation[]) => void;
  onShippingMethodSelected?: (methodId: string, price: number) => void;
}

export function EnhancedCartSummary({ 
  allowEditing = false, 
  showShippingCalculator = false,
  onShippingCalculated,
  onShippingMethodSelected
}: EnhancedCartSummaryProps) {
  const { items, total, updateQuantity, removeItem } = useCart();
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
      
      if (calculations.length > 0) {
        setSelectedShippingMethod(calculations[0].method_id);
        setShippingPrice(calculations[0].price);
        onShippingMethodSelected?.(calculations[0].method_id, calculations[0].price);
      }
      
      onShippingCalculated?.(calculations);
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
    onShippingMethodSelected?.(methodId, price);
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Carrinho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <CartItemDisplay
              key={item.product.id}
              item={item}
              allowEditing={allowEditing}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          ))}
          
          <CartTotals subtotal={total} shippingPrice={shippingPrice} />
          <CartActions allowEditing={allowEditing} />
        </CardContent>
      </Card>

      {showShippingCalculator && (
        <>
          <CartShippingCalculator
            onCalculateShipping={calculateShipping}
            calculating={calculatingShipping}
            cep={cep}
            onCepChange={handleCepChange}
          />

          {shippingCalculations.length > 0 && (
            <ShippingMethodSelector
              calculations={shippingCalculations}
              selectedMethodId={selectedShippingMethod}
              onMethodSelect={handleShippingMethodSelect}
              loading={calculatingShipping}
            />
          )}
        </>
      )}
    </div>
  );
}
