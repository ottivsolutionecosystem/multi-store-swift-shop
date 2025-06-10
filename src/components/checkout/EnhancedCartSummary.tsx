
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/ProductImage';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { CartShippingCalculator } from '@/components/cart/CartShippingCalculator';
import { useCart } from '@/contexts/CartContext';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingCalculation } from '@/types/shipping';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const finalTotal = total + shippingPrice;

  return (
    <div className="space-y-4">
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
              
              {allowEditing && (
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
              )}

              {!allowEditing && (
                <div className="text-sm text-gray-600">
                  Qtd: {item.quantity}
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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
          
          {allowEditing && (
            <div className="pt-4 border-t">
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          )}
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
