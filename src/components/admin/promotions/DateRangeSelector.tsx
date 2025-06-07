
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { DateTimeSelector } from './DateTimeSelector';
import { PromotionFormData } from '@/types/promotion';

interface DateRangeSelectorProps {
  setValue: UseFormSetValue<PromotionFormData>;
  watch: UseFormWatch<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
}

export function DateRangeSelector({ setValue, watch, errors }: DateRangeSelectorProps) {
  const startDate = watch('start_date');
  const endDate = watch('end_date');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DateTimeSelector
        label="Data e Hora de Início"
        value={startDate}
        onChange={(date) => setValue('start_date', date)}
        error={errors.start_date?.message}
        required
      />

      <DateTimeSelector
        label="Data e Hora de Fim"
        value={endDate}
        onChange={(date) => setValue('end_date', date)}
        error={errors.end_date?.message}
        required
      />
    </div>
  );
}
