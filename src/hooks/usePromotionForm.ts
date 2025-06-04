
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePromotionFormData } from './usePromotionFormData';
import { usePromotionFormSubmission } from './usePromotionFormSubmission';
import { promotionSchema, PromotionFormData } from '@/types/promotion';

interface UsePromotionFormProps {
  promotionId?: string;
  onSuccess: () => void;
}

export function usePromotionForm({ promotionId, onSuccess }: UsePromotionFormProps) {
  const defaultValues: PromotionFormData = {
    promotion_type: 'product',
    discount_type: 'percentage',
    priority: 0,
    status: 'draft',
    usage_limit_per_customer: 1,
    product_ids: [],
    category_ids: [],
    name: '',
    start_date: new Date(),
    end_date: new Date(),
    discount_value: 0,
  };

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { products, categories, isDataLoading } = usePromotionFormData({
    promotionId,
    form,
  });

  const { onSubmit, isLoading } = usePromotionFormSubmission({
    promotionId,
    onSuccess,
  });

  return {
    form,
    products,
    categories,
    isLoading,
    isDataLoading,
    onSubmit,
  };
}
