
import React, { useMemo, useCallback } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import { PromotionFormData } from '@/types/promotion';

interface PromotionPeriodSectionProps {
  register: UseFormRegister<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
  setValue: UseFormSetValue<PromotionFormData>;
  watch: UseFormWatch<PromotionFormData>;
  products: any[];
  categories: any[];
}

export function PromotionPeriodSection({ 
  register, 
  errors, 
  setValue, 
  watch, 
  products = [], 
  categories = [] 
}: PromotionPeriodSectionProps) {
  const promotionType = watch('promotion_type');
  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const selectedProductIds = watch('product_ids') || [];
  const selectedCategoryIds = watch('category_ids') || [];

  // Dados seguros com verificações mais robustas
  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      console.warn('⚠️ PromotionPeriod - Products is not an array:', products);
      return [];
    }
    const result = products.filter(p => p && p.id && p.name);
    console.log('🔧 PromotionPeriod - Safe products count:', result.length);
    return result;
  }, [products]);

  const safeCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      console.warn('⚠️ PromotionPeriod - Categories is not an array:', categories);
      return [];
    }
    const result = categories.filter(c => c && c.id && c.name);
    console.log('🔧 PromotionPeriod - Safe categories count:', result.length);
    return result;
  }, [categories]);

  const productOptions = useMemo(() => {
    const options = safeProducts.map(product => ({
      value: product.id,
      label: product.name
    }));
    console.log('🔧 PromotionPeriod - Product options created:', options.length);
    return options;
  }, [safeProducts]);

  const categoryOptions = useMemo(() => {
    const options = safeCategories.map(category => ({
      value: category.id,
      label: category.name
    }));
    console.log('🔧 PromotionPeriod - Category options created:', options.length);
    return options;
  }, [safeCategories]);

  // IDs selecionados sempre como arrays
  const safeSelectedProductIds = useMemo(() => {
    const result = Array.isArray(selectedProductIds) ? selectedProductIds : [];
    console.log('🔧 PromotionPeriod - Safe product IDs:', result);
    return result;
  }, [selectedProductIds]);

  const safeSelectedCategoryIds = useMemo(() => {
    const result = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [];
    console.log('🔧 PromotionPeriod - Safe category IDs:', result);
    return result;
  }, [selectedCategoryIds]);

  // Handlers com validação mais robusta
  const handleProductSelection = useCallback((selected: string[]) => {
    console.log('🔧 PromotionPeriod - Product selection handler called:', selected);
    
    try {
      if (!Array.isArray(selected)) {
        console.error('❌ PromotionPeriod - Invalid product selection:', selected);
        return;
      }
      
      const validSelection = selected.filter(id => typeof id === 'string' && id.trim());
      console.log('🔧 PromotionPeriod - Setting product_ids:', validSelection);
      
      setValue('product_ids', validSelection, { shouldValidate: true });
    } catch (error) {
      console.error('❌ PromotionPeriod - Error in product selection:', error);
    }
  }, [setValue]);

  const handleCategorySelection = useCallback((selected: string[]) => {
    console.log('🔧 PromotionPeriod - Category selection handler called:', selected);
    
    try {
      if (!Array.isArray(selected)) {
        console.error('❌ PromotionPeriod - Invalid category selection:', selected);
        return;
      }
      
      const validSelection = selected.filter(id => typeof id === 'string' && id.trim());
      console.log('🔧 PromotionPeriod - Setting category_ids:', validSelection);
      
      setValue('category_ids', validSelection, { shouldValidate: true });
    } catch (error) {
      console.error('❌ PromotionPeriod - Error in category selection:', error);
    }
  }, [setValue]);

  // Logs de debug para renderização
  console.log('🔧 PromotionPeriod render - promotion type:', promotionType);
  console.log('🔧 PromotionPeriod render - data ready:', {
    productsReady: safeProducts.length > 0,
    categoriesReady: safeCategories.length > 0
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Período e Aplicação</CardTitle>
        <CardDescription>
          Configure o período de validade e a aplicação da promoção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Seleção de Produtos */}
        {promotionType === 'product' && (
          <div className="space-y-2">
            <Label htmlFor="product_ids">Produtos *</Label>
            {productOptions.length > 0 ? (
              <MultiSelect
                options={productOptions}
                selected={safeSelectedProductIds}
                onSelectionChange={handleProductSelection}
                placeholder="Selecione os produtos..."
                searchPlaceholder="Buscar produtos..."
                emptyText="Nenhum produto encontrado"
              />
            ) : (
              <div className="p-4 text-center text-gray-500 border rounded-md">
                Carregando produtos...
              </div>
            )}
            {errors.product_ids && (
              <p className="text-sm text-red-600">{errors.product_ids.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Selecione um ou mais produtos para aplicar a promoção
            </p>
          </div>
        )}

        {/* Seleção de Categorias */}
        {promotionType === 'category' && (
          <div className="space-y-2">
            <Label htmlFor="category_ids">Categorias *</Label>
            {categoryOptions.length > 0 ? (
              <MultiSelect
                options={categoryOptions}
                selected={safeSelectedCategoryIds}
                onSelectionChange={handleCategorySelection}
                placeholder="Selecione as categorias..."
                searchPlaceholder="Buscar categorias..."
                emptyText="Nenhuma categoria encontrada"
              />
            ) : (
              <div className="p-4 text-center text-gray-500 border rounded-md">
                Carregando categorias...
              </div>
            )}
            {errors.category_ids && (
              <p className="text-sm text-red-600">{errors.category_ids.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Selecione uma ou mais categorias para aplicar a promoção
            </p>
          </div>
        )}

        {promotionType === 'global' && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800 text-sm">
              <strong>Promoção Global:</strong> Será aplicada a todos os produtos da loja que não possuem promoções específicas ativas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
