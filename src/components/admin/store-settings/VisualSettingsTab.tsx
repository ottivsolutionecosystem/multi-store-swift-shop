
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StoreSettingsFormData } from '@/types/store-settings';

interface VisualSettingsTabProps {
  form: UseFormReturn<StoreSettingsFormData>;
}

export function VisualSettingsTab({ form }: VisualSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cores da Loja</CardTitle>
          <CardDescription>
            Defina as cores principais que serão aplicadas na sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="primary_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Primária</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-20 h-10"
                      />
                      <Input
                        {...field}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Cor usada em botões, links e destaques
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Secundária</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-20 h-10"
                      />
                      <Input
                        {...field}
                        placeholder="#6b7280"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Cor usada em backgrounds e bordas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Preço</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-20 h-10"
                      />
                      <Input
                        {...field}
                        placeholder="#16a34a"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Cor exibida nos preços dos produtos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagens da Loja</CardTitle>
          <CardDescription>
            Configure logo e banner da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Logo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://exemplo.com/logo.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="banner_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Banner</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://exemplo.com/banner.jpg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
