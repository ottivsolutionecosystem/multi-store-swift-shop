
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PromotionFormData } from '@/types/promotion';

interface PromotionDiscountSectionProps {
  register: UseFormRegister<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
}

export function PromotionDiscountSection({ register, errors }: PromotionDiscountSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Desconto</CardTitle>
        <CardDescription>
          Defina o tipo e valor do desconto da promoção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
            {errors.discount_type && (
              <p className="text-sm text-red-600">{errors.discount_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_value">Valor do Desconto *</Label>
            <Input
              id="discount_value"
              type="number"
              step="0.01"
              min="0.01"
              {...register('discount_value', { valueAsNumber: true })}
              placeholder="Ex: 10 ou 50.00"
            />
            {errors.discount_value && (
              <p className="text-sm text-red-600">{errors.discount_value.message}</p>
            )}
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong> Use porcentagem para descontos proporcionais (ex: 20%) 
            ou valor fixo para descontos absolutos (ex: R$ 50,00).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
