
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddressForm } from '@/components/address/AddressForm';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { UserAddressFormData } from '@/types/user-address';

interface CustomAddressFormProps {
  form: UseFormReturn<UserAddressFormData>;
  onSubmit: (data: UserAddressFormData) => void;
}

export function CustomAddressForm({ form, onSubmit }: CustomAddressFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AddressForm form={form} showName={false} />
            <Button type="submit" className="mt-4">
              Confirmar Endereço
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
