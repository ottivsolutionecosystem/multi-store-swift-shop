
import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PromotionFormData } from '@/types/promotion';

interface PromotionAdvancedSectionProps {
  register: UseFormRegister<PromotionFormData>;
  setValue: UseFormSetValue<PromotionFormData>;
}

export function PromotionAdvancedSection({ register, setValue }: PromotionAdvancedSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Avançadas</CardTitle>
        <CardDescription>
          Configure limites e prioridade da promoção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minimum_purchase_amount">Valor Mínimo de Compra</Label>
            <Input
              id="minimum_purchase_amount"
              type="number"
              step="0.01"
              min="0"
              {...register('minimum_purchase_amount', { valueAsNumber: true })}
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500">
              Valor mínimo para aplicar a promoção
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Input
              id="priority"
              type="number"
              min="0"
              {...register('priority', { valueAsNumber: true })}
              placeholder="0"
            />
            <p className="text-sm text-gray-500">
              Maior número = maior prioridade
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Limite Total de Uso</Label>
            <Input
              id="usage_limit"
              type="number"
              min="1"
              {...register('usage_limit', { valueAsNumber: true })}
              placeholder="Ilimitado"
            />
            <p className="text-sm text-gray-500">
              Número máximo de usos da promoção
            </p>
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
            <p className="text-sm text-gray-500">
              Quantas vezes cada cliente pode usar
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong><br />
            • <strong>Valor Mínimo</strong>: O carrinho deve atingir este valor para a promoção ser válida<br />
            • <strong>Prioridade</strong>: Quando múltiplas promoções se aplicam, a de maior número tem preferência<br />
            • <strong>Limite Total</strong>: Quantas vezes a promoção pode ser usada no total (deixe vazio para ilimitado)<br />
            • <strong>Limite por Cliente</strong>: Quantas vezes cada cliente individual pode usar a promoção<br /><br />
            Exemplo: Uma promoção com prioridade 10 será aplicada antes de uma com prioridade 5.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
