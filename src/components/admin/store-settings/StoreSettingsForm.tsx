
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const storeSettingsSchema = z.object({
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida'),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida'),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  store_description: z.string().optional(),
  show_category: z.boolean(),
  show_description: z.boolean(),
  show_stock_quantity: z.boolean(),
  show_price: z.boolean(),
  show_promotion_badge: z.boolean(),
  promotion_display_format: z.enum(['percentage', 'comparison']),
});

type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;

export function StoreSettingsForm() {
  const { storeSettings, updateStoreSettings, isUpdating } = useStoreSettings();
  const services = useServices();

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
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
    },
  });

  React.useEffect(() => {
    if (storeSettings) {
      form.reset({
        primary_color: storeSettings.primary_color,
        secondary_color: storeSettings.secondary_color,
        logo_url: storeSettings.logo_url || '',
        banner_url: storeSettings.banner_url || '',
        store_description: storeSettings.store_description || '',
        show_category: storeSettings.show_category,
        show_description: storeSettings.show_description,
        show_stock_quantity: storeSettings.show_stock_quantity,
        show_price: storeSettings.show_price,
        show_promotion_badge: storeSettings.show_promotion_badge,
        promotion_display_format: storeSettings.promotion_display_format as 'percentage' | 'comparison',
      });
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
