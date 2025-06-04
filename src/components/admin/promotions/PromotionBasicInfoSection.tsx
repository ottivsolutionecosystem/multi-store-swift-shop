
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PromotionFormData } from '@/types/promotion';

interface PromotionBasicInfoSectionProps {
  register: UseFormRegister<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
}

export function PromotionBasicInfoSection({ register, errors }: PromotionBasicInfoSectionProps) {
  return (
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
          <p className="text-xs text-gray-500">
            Hierarquia: Global &gt; Categoria &gt; Produto Específico
          </p>
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
  );
}
