
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const promotionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  promotion_type: z.enum(['product', 'category', 'global']),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.number().min(0.01, 'Valor deve ser maior que 0'),
  start_date: z.date({ required_error: 'Data de início é obrigatória' }),
  end_date: z.date({ required_error: 'Data de fim é obrigatória' }),
  product_id: z.string().optional(),
  category_id: z.string().optional(),
  minimum_purchase_amount: z.number().min(0, 'Valor deve ser positivo').optional(),
  usage_limit: z.number().min(1, 'Limite deve ser maior que 0').optional(),
  usage_limit_per_customer: z.number().min(1, 'Limite deve ser maior que 0').optional(),
  priority: z.number().min(0, 'Prioridade deve ser positiva').default(0),
  is_active: z.boolean().default(true),
}).refine((data) => {
  if (data.discount_type === 'percentage' && data.discount_value > 100) {
    return false;
  }
  return true;
}, {
  message: 'Desconto em porcentagem não pode ser maior que 100%',
  path: ['discount_value'],
}).refine((data) => {
  return data.end_date > data.start_date;
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['end_date'],
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  promotionId?: string;
  onSuccess: () => void;
}

export function PromotionForm({ promotionId, onSuccess }: PromotionFormProps) {
  const services = useServices();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      promotion_type: 'product',
      discount_type: 'percentage',
      priority: 0,
      is_active: true,
      usage_limit_per_customer: 1,
    },
  });

  const promotionType = watch('promotion_type');
  const startDate = watch('start_date');
  const endDate = watch('end_date');

  useEffect(() => {
    const loadData = async () => {
      if (!services) return;

      try {
        const [productsData, categoriesData] = await Promise.all([
          services.productService.getAllProducts(),
          services.categoryService.getAllCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);

        if (promotionId) {
          const promotion = await services.promotionService.getPromotionById(promotionId);
          if (promotion) {
            reset({
              name: promotion.name,
              description: promotion.description || '',
              promotion_type: promotion.promotion_type as any,
              discount_type: promotion.discount_type,
              discount_value: Number(promotion.discount_value),
              start_date: new Date(promotion.start_date),
              end_date: new Date(promotion.end_date),
              product_id: promotion.product_id || undefined,
              category_id: promotion.category_id || undefined,
              minimum_purchase_amount: promotion.minimum_purchase_amount ? Number(promotion.minimum_purchase_amount) : undefined,
              usage_limit: promotion.usage_limit || undefined,
              usage_limit_per_customer: promotion.usage_limit_per_customer || 1,
              priority: promotion.priority,
              is_active: promotion.is_active,
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados necessários',
          variant: 'destructive',
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [services, promotionId, reset, toast]);

  const onSubmit = async (data: PromotionFormData) => {
    if (!services) return;

    setIsLoading(true);
    try {
      const promotionData = {
        name: data.name,
        description: data.description || null,
        promotion_type: data.promotion_type,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        product_id: data.promotion_type === 'product' ? data.product_id || null : null,
        category_id: data.promotion_type === 'category' ? data.category_id || null : null,
        minimum_purchase_amount: data.minimum_purchase_amount || 0,
        usage_limit: data.usage_limit || null,
        usage_limit_per_customer: data.usage_limit_per_customer || 1,
        priority: data.priority,
        is_active: data.is_active,
      };

      if (promotionId) {
        await services.promotionService.updatePromotion(promotionId, promotionData);
        toast({
          title: 'Sucesso',
          description: 'Promoção atualizada com sucesso!',
        });
      } else {
        await services.promotionService.createPromotion(promotionData);
        toast({
          title: 'Sucesso',
          description: 'Promoção criada com sucesso!',
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar promoção:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar promoção',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Promoção *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Desconto de Verão"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotion_type">Tipo de Promoção</Label>
            <select
              id="promotion_type"
              {...register('promotion_type')}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="product">Produto Específico</option>
              <option value="category">Categoria</option>
              <option value="global">Global</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descreva os detalhes da promoção..."
            rows={3}
          />
        </div>
      </div>

      {/* Configuração de Desconto */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Configuração de Desconto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="discount_type">Tipo de Desconto</Label>
            <select
              id="discount_type"
              {...register('discount_type')}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="percentage">Porcentagem (%)</option>
              <option value="fixed_amount">Valor Fixo (R$)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_value">Valor do Desconto *</Label>
            <Input
              id="discount_value"
              type="number"
              step="0.01"
              min="0"
              {...register('discount_value', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.discount_value && (
              <p className="text-sm text-red-600">{errors.discount_value.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Período e Aplicação */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Período e Aplicação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Data de Início *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => setValue('start_date', date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.start_date && (
              <p className="text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data de Fim *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => setValue('end_date', date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.end_date && (
              <p className="text-sm text-red-600">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        {/* Seleção Condicional */}
        {promotionType === 'product' && (
          <div className="space-y-2">
            <Label htmlFor="product_id">Produto</Label>
            <select
              id="product_id"
              {...register('product_id')}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {promotionType === 'category' && (
          <div className="space-y-2">
            <Label htmlFor="category_id">Categoria</Label>
            <select
              id="category_id"
              {...register('category_id')}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Configurações Avançadas */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Configurações Avançadas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minimum_purchase_amount">Compra Mínima (R$)</Label>
            <Input
              id="minimum_purchase_amount"
              type="number"
              step="0.01"
              min="0"
              {...register('minimum_purchase_amount', { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Limite Total de Uso</Label>
            <Input
              id="usage_limit"
              type="number"
              min="1"
              {...register('usage_limit', { valueAsNumber: true })}
              placeholder="Ilimitado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit_per_customer">Limite por Cliente</Label>
            <Input
              id="usage_limit_per_customer"
              type="number"
              min="1"
              {...register('usage_limit_per_customer', { valueAsNumber: true })}
              placeholder="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Input
              id="priority"
              type="number"
              min="0"
              {...register('priority', { valueAsNumber: true })}
              placeholder="0"
            />
            <p className="text-sm text-gray-600">Maior valor = maior prioridade</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              {...register('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Promoção Ativa</Label>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {promotionId ? 'Atualizar Promoção' : 'Criar Promoção'}
        </Button>
      </div>
    </form>
  );
}
