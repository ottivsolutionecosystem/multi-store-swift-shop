
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AddressForm } from '@/components/address/AddressForm';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { userAddressSchema, UserAddressFormData, UserAddress } from '@/types/user-address';

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: UserAddress | null;
  onClose: () => void;
}

export function AddressFormDialog({ open, onOpenChange, address, onClose }: AddressFormDialogProps) {
  const { createAddress, updateAddress, isCreating, isUpdating } = useUserAddresses();
  
  const form = useForm<UserAddressFormData>({
    resolver: zodResolver(userAddressSchema),
    defaultValues: {
      name: '',
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

  React.useEffect(() => {
    if (address) {
      form.reset({
        name: address.name,
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        is_default: address.is_default,
      });
    } else {
      form.reset({
        name: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        is_default: false,
      });
    }
  }, [address, form]);

  const onSubmit = (data: UserAddressFormData) => {
    if (address) {
      updateAddress({ id: address.id, data }, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      createAddress(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Editar Endereço' : 'Novo Endereço'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AddressForm form={form} showName={true} />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : address ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
