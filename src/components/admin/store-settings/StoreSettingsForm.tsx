
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTenant } from '@/contexts/TenantContext';
import { useStoreSettingsUpdate } from '@/hooks/useStoreSettingsUpdate';
import { storeSettingsSchema, StoreSettingsFormData } from '@/types/store-settings';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { VisualSettingsTab } from './VisualSettingsTab';
import { ProductSettingsTab } from './ProductSettingsTab';
import { OriginAddressTab } from './OriginAddressTab';
import { PaymentSettingsTab } from './PaymentSettingsTab';

export function StoreSettingsForm() {
  const { store, loading: tenantLoading } = useTenant();
  const { updateStoreSettings, isUpdating } = useStoreSettingsUpdate();

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
      origin_address: undefined,
      payment_settings: {
        gateways: [],
        enabledMethods: [],
      },
    },
  });

  React.useEffect(() => {
    if (store?.store_settings) {
      console.log('StoreSettingsForm - updating form with settings from tenant:', store.store_settings);
      const settings = store.store_settings;
      
      form.reset({
        primary_color: settings.primary_color || '#3b82f6',
        secondary_color: settings.secondary_color || '#6b7280',
        price_color: settings.price_color || '#16a34a',
        logo_url: settings.logo_url || '',
        banner_url: settings.banner_url || '',
        store_description: settings.store_description || '',
        show_category: settings.show_category ?? true,
        show_description: settings.show_description ?? true,
        show_stock_quantity: settings.show_stock_quantity ?? true,
        show_price: settings.show_price ?? true,
        show_promotion_badge: settings.show_promotion_badge ?? true,
        origin_address: (settings.origin_address && typeof settings.origin_address === 'object' && settings.origin_address !== null) 
          ? settings.origin_address as any 
          : undefined,
        payment_settings: (settings.payment_settings && typeof settings.payment_settings === 'object' && settings.payment_settings !== null)
          ? settings.payment_settings as any
          : { gateways: [], enabledMethods: [] },
      });
    }
  }, [store?.store_settings, form]);

  const onSubmit = (data: StoreSettingsFormData) => {
    console.log('StoreSettingsForm - submitting data:', data);
    updateStoreSettings(data);
  };

  if (tenantLoading || !store) {
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
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

          <TabsContent value="payment" className="space-y-4">
            <PaymentSettingsTab />
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
