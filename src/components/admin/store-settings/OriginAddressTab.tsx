
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressForm } from '@/components/address/AddressForm';
import { StoreSettingsFormData } from '@/types/store-settings';

interface OriginAddressTabProps {
  form: UseFormReturn<StoreSettingsFormData>;
}

export function OriginAddressTab({ form }: OriginAddressTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço de Origem</CardTitle>
        <CardDescription>
          Configure o endereço de origem para cálculo de frete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddressForm form={form} prefix="origin_address" />
      </CardContent>
    </Card>
  );
}
