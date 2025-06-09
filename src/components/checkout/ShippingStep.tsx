import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputMask } from '@/components/ui/input-mask';
import { AddressForm } from '@/components/address/AddressForm';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShippingCalculation } from '@/types/shipping';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressSchema, UserAddressFormData } from '@/types/user-address';
import { Form } from '@/components/ui/form';

interface ShippingStepProps {
  guestUser: any;
  onShippingSelect: (methodId: string, price: number) => void;
  onAddressSelect: (address: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ShippingStep({ guestUser, onShippingSelect, onAddressSelect, onNext, onPrevious }: ShippingStepProps) {
  const services = useServices();
  const { user } = useAuth();
  const { items } = useCart();
  const { toast } = useToast();
  
  const [cep, setCep] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [shippingCalculations, setShippingCalculations] = useState<ShippingCalculation[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const form = useForm<UserAddressFormData>({
    resolver: zodResolver(userAddressSchema),
    defaultValues: {
      name: 'Endereço de Entrega',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      is_default: false,
    },
  });

  const calculateShipping = async (zipCode: string) => {
    if (!services || !zipCode.trim()) {
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
      const calculations = await services.shippingService.calculateShipping(items, zipCode);
      setShippingCalculations(calculations);
      
      // Auto-select the first available method
      if (calculations.length > 0) {
        setSelectedShippingMethod(calculations[0].method_id);
        setShippingPrice(calculations[0].price);
        onShippingSelect(calculations[0].method_id, calculations[0].price);
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
    onShippingSelect(methodId, price);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value;
    setCep(newCep);
    
    // Auto-calculate shipping when CEP is complete
    if (newCep.replace(/\D/g, '').length === 8) {
      calculateShipping(newCep);
    }
  };

  const handleCustomAddressSubmit = (data: UserAddressFormData) => {
    onAddressSelect(data);
    calculateShipping(data.zip_code);
  };

  const canProceed = selectedShippingMethod && (cep || useCustomAddress);

  return (
    <div className="space-y-6">
      {/* CEP Quick Input */}
      <Card>
        <CardHeader>
          <CardTitle>Calcular Frete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cep">CEP de Entrega</Label>
            <div className="flex gap-2">
              <InputMask
                mask="cep"
                id="cep"
                placeholder="00000-000"
                value={cep}
                onChange={handleCepChange}
              />
              <Button 
                onClick={() => calculateShipping(cep)}
                disabled={calculatingShipping || !cep.trim()}
                variant="outline"
              >
                {calculatingShipping ? 'Calculando...' : 'Calcular'}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="custom-address"
              checked={useCustomAddress}
              onChange={(e) => setUseCustomAddress(e.target.checked)}
            />
            <Label htmlFor="custom-address">
              Informar endereço completo de entrega
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Custom Address Form */}
      {useCustomAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCustomAddressSubmit)}>
                <AddressForm form={form} showName={false} />
                <Button type="submit" className="mt-4">
                  Confirmar Endereço
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Shipping Methods */}
      {shippingCalculations.length > 0 && (
        <ShippingMethodSelector
          calculations={shippingCalculations}
          selectedMethodId={selectedShippingMethod}
          onMethodSelect={handleShippingMethodSelect}
          loading={calculatingShipping}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Voltar
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
        >
          Continuar para Finalização
        </Button>
      </div>
    </div>
  );
}
