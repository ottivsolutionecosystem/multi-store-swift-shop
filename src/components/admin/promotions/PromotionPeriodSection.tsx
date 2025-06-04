
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PromotionFormData {
  name: string;
  description?: string;
  promotion_type: 'product' | 'category' | 'global';
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  start_date: Date;
  end_date: Date;
  product_id?: string;
  category_id?: string;
  minimum_purchase_amount?: number;
  usage_limit?: number;
  usage_limit_per_customer?: number;
  priority: number;
  is_active: boolean;
}

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
  products, 
  categories 
}: PromotionPeriodSectionProps) {
  const promotionType = watch('promotion_type');
  const startDate = watch('start_date');
  const endDate = watch('end_date');

  return (
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
  );
}
