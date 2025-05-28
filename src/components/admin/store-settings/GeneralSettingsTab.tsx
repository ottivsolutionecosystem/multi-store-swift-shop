
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StoreSettingsFormData } from '@/types/store-settings';

interface GeneralSettingsTabProps {
  form: UseFormReturn<StoreSettingsFormData>;
}

export function GeneralSettingsTab({ form }: GeneralSettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
        <CardDescription>
          Configure informações básicas da sua loja
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="store_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Loja</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva sua loja..."
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Descrição que aparecerá na página principal da loja
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
