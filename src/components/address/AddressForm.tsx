
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputMask } from '@/components/ui/input-mask';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix?: string;
  showName?: boolean;
}

export function AddressForm({ form, prefix = '', showName = true }: AddressFormProps) {
  const getFieldName = (field: string) => {
    return prefix ? `${prefix}.${field}` : field;
  };

  return (
    <div className="space-y-4">
      {showName && (
        <FormField
          control={form.control}
          name={getFieldName('name')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Endereço</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Casa, Trabalho" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName('zip_code')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <InputMask mask="cep" {...field} placeholder="00000-000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={getFieldName('state')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} placeholder="SP" maxLength={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={getFieldName('city')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input {...field} placeholder="São Paulo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName('neighborhood')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bairro</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Centro" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name={getFieldName('street')}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Rua das Flores" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={getFieldName('number')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={getFieldName('complement')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complemento (opcional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Apto 45, Bloco B" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
