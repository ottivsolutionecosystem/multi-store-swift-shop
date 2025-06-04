
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangeSelector } from './DateRangeSelector';
import { ProductMultiSelect } from './ProductMultiSelect';
import { CategoryMultiSelect } from './CategoryMultiSelect';
import { PromotionTypeInfo } from './PromotionTypeInfo';
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

  console.log('🔧 PromotionPeriodSection render - promotion type:', promotionType);
  console.log('🔧 PromotionPeriodSection render - data ready:', {
    productsReady: Array.isArray(products) && products.length > 0,
    categoriesReady: Array.isArray(categories) && categories.length > 0
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
        <DateRangeSelector 
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

        {promotionType === 'product' && (
          <ProductMultiSelect
            setValue={setValue}
            watch={watch}
            errors={errors}
            products={products}
          />
        )}

        {promotionType === 'category' && (
          <CategoryMultiSelect
            setValue={setValue}
            watch={watch}
            errors={errors}
            categories={categories}
          />
        )}

        {promotionType === 'global' && <PromotionTypeInfo />}
      </CardContent>
    </Card>
  );
}
