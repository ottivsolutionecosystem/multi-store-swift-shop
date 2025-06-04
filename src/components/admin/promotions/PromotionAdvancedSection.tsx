
import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

interface PromotionAdvancedSectionProps {
  register: UseFormRegister<PromotionFormData>;
  setValue: UseFormSetValue<PromotionFormData>;
}

export function PromotionAdvancedSection({ register, setValue }: PromotionAdvancedSectionProps) {
  return (
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
  );
}
