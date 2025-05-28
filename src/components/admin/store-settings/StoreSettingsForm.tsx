
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useServices } from '@/hooks/useServices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Palette, Settings, Package } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { VisualSettingsTab } from './VisualSettingsTab';
import { ProductSettingsTab } from './ProductSettingsTab';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { storeSettingsSchema, StoreSettingsFormData } from '@/types/store-settings';

const defaultValues: StoreSettingsFormData = {
  primary_color: '#3b82f6',
  secondary_color: '#6b7280',
  logo_url: '',
  banner_url: '',
  store_description: '',
  show_category: true,
  show_description: true,
  show_stock_quantity: true,
  show_price: true,
  show_promotion_badge: true,
  promotion_display_format: 'percentage',
};

export function StoreSettingsForm() {
  const { storeSettings, updateStoreSettings, isUpdating } = useStoreSettings();
  const services = useServices();

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues,
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (storeSettings) {
      const formData: StoreSettingsFormData = {
        primary_color: storeSettings.primary_color || defaultValues.primary_color,
        secondary_color: storeSettings.secondary_color || defaultValues.secondary_color,
        logo_url: storeSettings.logo_url || defaultValues.logo_url,
        banner_url: storeSettings.banner_url || defaultValues.banner_url,
        store_description: storeSettings.store_description || defaultValues.store_description,
        show_category: storeSettings.show_category ?? defaultValues.show_category,
        show_description: storeSettings.show_description ?? defaultValues.show_description,
        show_stock_quantity: storeSettings.show_stock_quantity ?? defaultValues.show_stock_quantity,
        show_price: storeSettings.show_price ?? defaultValues.show_price,
        show_promotion_badge: storeSettings.show_promotion_badge ?? defaultValues.show_promotion_badge,
        promotion_display_format: (storeSettings.promotion_display_format as 'percentage' | 'comparison') || defaultValues.promotion_display_format,
      };
      form.reset(formData);
    }
  }, [storeSettings, form]);

  const onSubmit = (data: StoreSettingsFormData) => {
    console.log('Submitting store settings:', data);
    console.log('Services available:', !!services);
    updateStoreSettings(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="visual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual">
            <VisualSettingsTab form={form} />
          </TabsContent>

          <TabsContent value="products">
            <ProductSettingsTab form={form} />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettingsTab form={form} />
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isUpdating || !services}
            className="min-w-[120px]"
          >
            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
