
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { storeSettingsSchema, StoreSettingsFormData } from '@/types/store-settings';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { VisualSettingsTab } from './VisualSettingsTab';
import { ProductSettingsTab } from './ProductSettingsTab';
import { OriginAddressTab } from './OriginAddressTab';

export function StoreSettingsForm() {
  const { storeSettings, updateStoreSettings, isLoading, isUpdating } = useStoreSettings();

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      primary_color: '#3b82f6',
      secondary_color: '#6b7280',
      price_color: '#16a34a',
      logo_url: '',
      banner_url: '',
      store_description: '',
      show_category: true,
      show_description: true,
      show_stock_quantity: true,
      show_price: true,
      show_promotion_badge: true,
      promotion_display_format: 'percentage',
      origin_address: undefined,
    },
  });

  React.useEffect(() => {
    if (storeSettings) {
      console.log('StoreSettingsForm - updating form with settings:', storeSettings);
      
      // Handle origin_address safely - it could be Json type from DB
      let originAddress;
      if (storeSettings.origin_address && typeof storeSettings.origin_address === 'object') {
        originAddress = storeSettings.origin_address as any;
      }
      
      form.reset({
        primary_color: storeSettings.primary_color || '#3b82f6',
        secondary_color: storeSettings.secondary_color || '#6b7280',
        price_color: storeSettings.price_color || '#16a34a',
        logo_url: storeSettings.logo_url || '',
        banner_url: storeSettings.banner_url || '',
        store_description: storeSettings.store_description || '',
        show_category: storeSettings.show_category ?? true,
        show_description: storeSettings.show_description ?? true,
        show_stock_quantity: storeSettings.show_stock_quantity ?? true,
        show_price: storeSettings.show_price ?? true,
        show_promotion_badge: storeSettings.show_promotion_badge ?? true,
        promotion_display_format: storeSettings.promotion_display_format || 'percentage',
        origin_address: originAddress || undefined,
      });
    }
  }, [storeSettings, form]);

  const onSubmit = (data: StoreSettingsFormData) => {
    console.log('StoreSettingsForm - submitting data:', data);
    updateStoreSettings(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <GeneralSettingsTab form={form} />
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            <VisualSettingsTab form={form} />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductSettingsTab form={form} />
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <OriginAddressTab form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
