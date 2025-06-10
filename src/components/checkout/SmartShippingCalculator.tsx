
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { CepInput } from './CepInput';
import { ShippingCalculatorActions } from './ShippingCalculatorActions';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingCalculation } from '@/types/shipping';

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

  const [shippingCalculations, setShippingCalculations] = useState<ShippingCalculation[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [hasExpressMethods, setHasExpressMethods] = useState(false);
  const [hasApiMethods, setHasApiMethods] = useState(false);
  const [autoCalculated, setAutoCalculated] = useState(false);
  const [defaultAddressCep, setDefaultAddressCep] = useState<string>('');

  // Get default address CEP
  useEffect(() => {
    if (user && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        console.log('SmartShippingCalculator - Found default address:', defaultAddress);
        setDefaultAddressCep(defaultAddress.zip_code);
      }
    }
  }, [user, addresses]);

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
        
        console.log('SmartShippingCalculator - Shipping methods check:', {
          expressMethods: expressMethods.length,
          apiMethods: apiMethods.length
        });
      } catch (error) {
        console.error('Error checking shipping methods:', error);
      }
    };

    checkShippingMethods();
  }, [services]);

  // Auto-calculate shipping when conditions are met
  useEffect(() => {
    const shouldAutoCalculate = 
      user && 
      defaultAddressCep && 
      hasExpressMethods && 
      !autoCalculated && 
      items.length > 0 &&
      services;

    console.log('SmartShippingCalculator - Auto-calculate check:', {
      user: !!user,
      defaultAddressCep,
      hasExpressMethods,
      autoCalculated,
      itemsLength: items.length,
      services: !!services,
      shouldAutoCalculate
    });

    if (shouldAutoCalculate) {
      console.log('SmartShippingCalculator - Auto-calculating shipping for default address');
      calculateShipping(defaultAddressCep);
      setAutoCalculated(true);
    }
  }, [user, defaultAddressCep, hasExpressMethods, autoCalculated, items.length, services]);

  const calculateShipping = async (cep: string) => {
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
      console.log('SmartShippingCalculator - Calculating shipping for CEP:', cep);
      
      const calculations = await services.shippingService.calculateShipping(items, cep);
      setShippingCalculations(calculations);
      
      // Auto-select express method if available, otherwise select first
      const expressCalculation = calculations.find(calc => 
        calc.method_name.toLowerCase().includes('express')
      );
      
      const selectedCalc = expressCalculation || calculations[0];
      if (selectedCalc) {
        console.log('SmartShippingCalculator - Auto-selecting method:', selectedCalc);
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
        <CepInput
          onCepCalculate={calculateShipping}
          calculating={calculatingShipping}
          initialCep={defaultAddressCep}
          showAutoFillIndicator={!!defaultAddressCep}
        />

        <ShippingCalculatorActions
          shouldShowCalculateButton={shouldShowCalculateButton}
          calculatingShipping={calculatingShipping}
          cep=""
          onCalculateShipping={() => {}}
        />

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
