
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Palette, Settings, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

export default function StoreSettingsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { storeSettings, isLoading, updateStoreSettings, isUpdating } = useStoreSettings();
  const navigate = useNavigate();

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      primary_color: storeSettings?.primary_color || '#3b82f6',
      secondary_color: storeSettings?.secondary_color || '#6b7280',
      logo_url: storeSettings?.logo_url || '',
      banner_url: storeSettings?.banner_url || '',
      store_description: storeSettings?.store_description || '',
      show_category: storeSettings?.show_category ?? true,
      show_description: storeSettings?.show_description ?? true,
      show_stock_quantity: storeSettings?.show_stock_quantity ?? true,
      show_price: storeSettings?.show_price ?? true,
      show_promotion_badge: storeSettings?.show_promotion_badge ?? true,
      promotion_display_format: (storeSettings?.promotion_display_format as 'percentage' | 'comparison') || 'percentage',
    },
  });

  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, authLoading, navigate]);

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
    updateStoreSettings(data);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
        </div>

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

              <TabsContent value="visual" className="space-y-6">
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
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Exibição do Card de Produtos</CardTitle>
                    <CardDescription>
                      Configure quais informações serão exibidas nos cards dos produtos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="show_category"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Categoria</FormLabel>
                              <FormDescription>
                                Exibir categoria do produto
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="show_description"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Descrição</FormLabel>
                              <FormDescription>
                                Exibir descrição do produto
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="show_stock_quantity"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Estoque</FormLabel>
                              <FormDescription>
                                Exibir quantidade em estoque
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="show_price"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Preço</FormLabel>
                              <FormDescription>
                                Exibir preço do produto
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="show_promotion_badge"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Badge de Promoção</FormLabel>
                              <FormDescription>
                                Exibir badge quando produto estiver em promoção
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="promotion_display_format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Formato de Exibição da Promoção</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o formato" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Porcentagem (30% ↓)</SelectItem>
                                <SelectItem value="comparison">Comparação (De R$ 100 por R$ 70)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Como as promoções serão exibidas nos produtos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="general" className="space-y-6">
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
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isUpdating}
                className="min-w-[120px]"
              >
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
