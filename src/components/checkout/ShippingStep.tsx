
import React, { useState } from 'react';
import { ShippingMethodSelector } from '@/components/cart/ShippingMethodSelector';
import { CepInput } from '@/components/checkout/CepInput';
import { CustomAddressForm } from '@/components/checkout/CustomAddressForm';
import { ShippingNavigation } from '@/components/checkout/ShippingNavigation';
import { useShippingCalculation } from '@/hooks/useShippingCalculation';
import { useCart } from '@/contexts/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressSchema, UserAddressFormData } from '@/types/user-address';

interface ShippingStepProps {
  guestUser: any;
  onShippingSelect: (methodId: string, price: number) => void;
  onAddressSelect: (address: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ShippingStep({ guestUser, onShippingSelect, onAddressSelect, onNext, onPrevious }: ShippingStepProps) {
  const { items } = useCart();
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  
  const {
    shippingCalculations,
    selectedShippingMethod,
    shippingPrice,
    calculatingShipping,
    calculateShipping,
    handleShippingMethodSelect,
  } = useShippingCalculation();

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

  const handleCepCalculate = async (cep: string) => {
    const calculations = await calculateShipping(items, cep);
    if (calculations && calculations.length > 0) {
      onShippingSelect(calculations[0].method_id, calculations[0].price);
    }
  };

  const handleShippingSelect = (methodId: string, price: number) => {
    handleShippingMethodSelect(methodId, price);
    onShippingSelect(methodId, price);
  };

  const handleCustomAddressSubmit = (data: UserAddressFormData) => {
    onAddressSelect(data);
    calculateShipping(items, data.zip_code);
  };

  const zipCode = form.watch('zip_code');
  const canProceed = selectedShippingMethod && (Boolean(zipCode) || !useCustomAddress);

  return (
    <div className="space-y-6">
      <CepInput
        onCepCalculate={handleCepCalculate}
        onUseCustomAddress={setUseCustomAddress}
        calculating={calculatingShipping}
      />

      {useCustomAddress && (
        <CustomAddressForm
          form={form}
          onSubmit={handleCustomAddressSubmit}
        />
      )}

      {shippingCalculations.length > 0 && (
        <ShippingMethodSelector
          calculations={shippingCalculations}
          selectedMethodId={selectedShippingMethod}
          onMethodSelect={handleShippingSelect}
          loading={calculatingShipping}
        />
      )}

      <ShippingNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        canProceed={canProceed}
      />
    </div>
  );
}
