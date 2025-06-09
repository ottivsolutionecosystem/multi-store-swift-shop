
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputMask } from '@/components/ui/input-mask';
import { AddressFormData } from '@/types/store-settings';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix?: string;
  showName?: boolean;
}

export function AddressForm({ form, prefix = '', showName = false }: AddressFormProps) {
  const getFieldName = (field: string) => prefix ? `${prefix}.${field}` : field;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {showName && (
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name={getFieldName('name')}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Casa, Trabalho..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name={getFieldName('zip_code')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <InputMask
                mask="cep"
                placeholder="00000-000"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName('street')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rua</FormLabel>
            <FormControl>
              <Input placeholder="Nome da rua" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName('number')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número</FormLabel>
            <FormControl>
              <Input placeholder="123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName('complement')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complemento</FormLabel>
            <FormControl>
              <Input placeholder="Apto, Bloco, etc..." {...field} />
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
              <Input placeholder="Nome do bairro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName('city')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input placeholder="Nome da cidade" {...field} />
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
              <Input placeholder="SP" maxLength={2} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
