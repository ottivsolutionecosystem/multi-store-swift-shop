
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputMask } from '@/components/ui/input-mask';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, CheckCircle } from 'lucide-react';
import { useCepLookup } from '@/hooks/useCepLookup';
import { AddressFormData } from '@/types/store-settings';
import { useToast } from '@/hooks/use-toast';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix?: string;
  showName?: boolean;
}

export function AddressForm({ form, prefix = '', showName = false }: AddressFormProps) {
  const { lookup, isLoading, error, data, clearError } = useCepLookup();
  const { toast } = useToast();
  
  const getFieldName = (field: string) => prefix ? `${prefix}.${field}` : field;

  // Função para limpar CEP e verificar se está completo
  const cleanCep = (cep: string) => cep.replace(/\D/g, '');
  
  // Auto-preenchimento quando CEP é encontrado
  useEffect(() => {
    if (data) {
      console.log('AddressForm - Auto-filling address from CEP lookup:', data);
      
      form.setValue(getFieldName('street'), data.street);
      form.setValue(getFieldName('neighborhood'), data.neighborhood);
      form.setValue(getFieldName('city'), data.city);
      form.setValue(getFieldName('state'), data.state);
      
      toast({
        title: 'CEP encontrado!',
        description: 'Endereço preenchido automaticamente.',
        variant: 'default',
      });
    }
  }, [data, form, getFieldName, toast]);

  // Mostrar erro quando houver falha na consulta
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro na consulta do CEP',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Função para consultar CEP automaticamente
  const handleCepChange = async (cep: string) => {
    const cleanedCep = cleanCep(cep);
    
    // Limpar erro anterior
    clearError();
    
    // Consultar automaticamente quando CEP estiver completo (8 dígitos)
    if (cleanedCep.length === 8) {
      console.log('AddressForm - CEP complete, starting lookup:', cleanedCep);
      await lookup(cleanedCep);
    }
  };

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
            <FormLabel className="flex items-center gap-2">
              CEP
              {isLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
              {data && <CheckCircle className="h-3 w-3 text-green-500" />}
            </FormLabel>
            <FormControl>
              <InputMask
                mask="cep"
                placeholder="00000-000"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleCepChange(e.target.value);
                }}
              />
            </FormControl>
            {data && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <MapPin className="h-3 w-3" />
                <span>Endereço encontrado automaticamente</span>
              </div>
            )}
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
