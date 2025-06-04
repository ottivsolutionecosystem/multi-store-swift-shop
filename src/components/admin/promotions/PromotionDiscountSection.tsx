
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface PromotionDiscountSectionProps {
  register: UseFormRegister<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
}

export function PromotionDiscountSection({ register, errors }: PromotionDiscountSectionProps) {
  return (
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
  );
}
