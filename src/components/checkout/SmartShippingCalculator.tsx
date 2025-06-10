
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingCalculation } from '@/types/shipping';
import { Loader2 } from 'lucide-react';

interface SmartShippingCalculatorProps {
  items: any[];
  onShippingCalculated?: (calculations: ShippingCalculation[]) => void;
  onShippingMethodSelected?: (methodId: string, price: number) => void;
}

export function SmartShippingCalculator({ 
  items, 
  onShippingCalculated, 
  onShippingMethodSelected 
}: SmartShippingCalculatorProps) {
  const { user } = useAuth();
  const { addresses } = useUserAddresses();
  const services = useServices();
  const { toast } = useToast();

  const [cep, setCep] = useState('');
  const [shippingCalculations, setShippingCalculations] = useState<ShippingCalculation[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [hasExpressMethods, setHasExpressMethods] = useState(false);
  const [hasApiMethods, setHasApiMethods] = useState(false);
  const [autoCalculated, setAutoCalculated] = useState(false);

  // Format CEP input
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

  // Check available shipping methods
  useEffect(() => {
    const checkShippingMethods = async () => {
      if (!services) return;

      try {
        const methods = await services.shippingService.getActiveShippingMethods();
        const expressMethods = methods.filter(m => m.type === 'express');
        const apiMethods = methods.filter(m => m.type === 'api');
        
        setHasExpressMethods(expressMethods.length > 0);
        setHasApiMethods(apiMethods.length > 0);
      } catch (error) {
        console.error('Error checking shipping methods:', error);
      }
    };

    checkShippingMethods();
  }, [services]);

  // Auto-fill CEP for logged users
  useEffect(() => {
    if (user && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
      if (defaultAddress && defaultAddress.zip_code) {
        setCep(formatCep(defaultAddress.zip_code));
      }
    }
  }, [user, addresses]);

  // Auto-calculate if user is logged, has CEP, has express methods, and hasn't calculated yet
  useEffect(() => {
    if (user && cep && hasExpressMethods && !autoCalculated && items.length > 0) {
      calculateShipping();
      setAutoCalculated(true);
    }
  }, [user, cep, hasExpressMethods, autoCalculated, items]);

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
      
      // Auto-select express method if available
      const expressCalculation = calculations.find(calc => 
        calc.method_name.toLowerCase().includes('express')
      );
      
      const selectedCalc = expressCalculation || calculations[0];
      if (selectedCalc) {
        setSelectedShippingMethod(selectedCalc.method_id);
        setShippingPrice(selectedCalc.price);
        onShippingMethodSelected?.(selectedCalc.method_id, selectedCalc.price);
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

  const shouldShowCalculateButton = hasApiMethods || !hasExpressMethods;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calcular Frete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP de Entrega</Label>
          <Input
            id="cep"
            type="text"
            placeholder="00000-000"
            value={cep}
            onChange={handleCepChange}
            maxLength={9}
          />
        </div>

        {shouldShowCalculateButton && (
          <Button 
            onClick={calculateShipping}
            disabled={!cep.trim() || calculatingShipping}
            className="w-full"
          >
            {calculatingShipping ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              'Calcular Frete'
            )}
          </Button>
        )}

        {calculatingShipping && !shouldShowCalculateButton && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span className="text-sm text-muted-foreground">Calculando frete...</span>
          </div>
        )}

        {shippingCalculations.length > 0 && (
          <ShippingMethodSelector
            calculations={shippingCalculations}
            selectedMethodId={selectedShippingMethod}
            onMethodSelect={handleShippingMethodSelect}
            loading={calculatingShipping}
          />
        )}
      </CardContent>
    </Card>
  );
}
