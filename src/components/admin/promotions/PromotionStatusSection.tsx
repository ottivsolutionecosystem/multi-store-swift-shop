
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PromotionFormData } from '@/types/promotion';

interface PromotionStatusSectionProps {
  register: UseFormRegister<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
  setValue: (name: keyof PromotionFormData, value: any) => void;
  watch: (name: keyof PromotionFormData) => any;
}

export function PromotionStatusSection({ 
  register, 
  errors, 
  setValue, 
  watch 
}: PromotionStatusSectionProps) {
  const statusValue = watch('status');

  const statusOptions = [
    { value: 'draft', label: 'Rascunho', description: 'Promoção não publicada' },
    { value: 'scheduled', label: 'Agendada', description: 'Será ativada na data de início' },
    { value: 'active', label: 'Ativa', description: 'Promoção em funcionamento' },
    { value: 'inactive', label: 'Inativa', description: 'Promoção desabilitada' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da Promoção</CardTitle>
        <CardDescription>
          Defina o status inicial da promoção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusValue}
            onValueChange={(value) => setValue('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong> Se você definir como "Agendada", a promoção será automaticamente 
            ativada na data de início e expirada na data de fim.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
