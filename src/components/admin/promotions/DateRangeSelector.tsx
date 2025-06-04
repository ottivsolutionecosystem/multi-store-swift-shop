
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  );
}
