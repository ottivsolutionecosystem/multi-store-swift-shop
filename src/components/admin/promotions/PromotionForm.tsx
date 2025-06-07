
import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePromotionForm } from '@/hooks/usePromotionForm';
import { PromotionBasicInfoSection } from './PromotionBasicInfoSection';
import { PromotionStatusSection } from './PromotionStatusSection';
import { PromotionDiscountSection } from './PromotionDiscountSection';
import { PromotionPeriodSection } from './PromotionPeriodSection';
import { PromotionAdvancedSection } from './PromotionAdvancedSection';
import { PromotionFormActions } from './PromotionFormActions';

interface PromotionFormProps {
  promotionId?: string;
  onSuccess: () => void;
}

export function PromotionForm({ promotionId, onSuccess }: PromotionFormProps) {
  const {
    form,
    products,
    categories,
    isLoading,
    isDataLoading,
    onSubmit,
  } = usePromotionForm({ promotionId, onSuccess });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const handleCancel = () => {
    window.history.back();
  };

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PromotionBasicInfoSection register={register} errors={errors} />
      
      <PromotionStatusSection 
        register={register} 
        errors={errors} 
        setValue={setValue} 
        watch={watch}
      />
      
      <PromotionDiscountSection register={register} errors={errors} />
      
      <PromotionPeriodSection 
        register={register} 
        errors={errors} 
        setValue={setValue} 
        watch={watch}
        products={products}
        categories={categories}
      />
      
      <PromotionAdvancedSection 
        register={register} 
        setValue={setValue} 
        watch={watch}
      />
      
      <PromotionFormActions 
        isLoading={isLoading} 
        promotionId={promotionId} 
        onCancel={handleCancel}
      />
    </form>
  );
}
