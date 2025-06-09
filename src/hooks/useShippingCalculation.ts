
import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingCalculation } from '@/types/shipping';

export function useShippingCalculation() {
  const services = useServices();
  const { toast } = useToast();
  
  const [shippingCalculations, setShippingCalculations] = useState<ShippingCalculation[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const calculateShipping = async (items: any[], zipCode: string) => {
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
      }
      
      return calculations;
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao calcular frete',
        variant: 'destructive',
      });
      return [];
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleShippingMethodSelect = (methodId: string, price: number) => {
    setSelectedShippingMethod(methodId);
    setShippingPrice(price);
  };

  return {
    shippingCalculations,
    selectedShippingMethod,
    shippingPrice,
    calculatingShipping,
    calculateShipping,
    handleShippingMethodSelect,
  };
}
