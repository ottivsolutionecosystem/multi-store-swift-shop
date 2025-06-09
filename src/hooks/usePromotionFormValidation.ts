
import { useToast } from '@/hooks/use-toast';
import { PromotionFormData } from '@/types/promotion';

export function usePromotionFormValidation() {
  const { toast } = useToast();

  const validateSubmissionData = (data: PromotionFormData): boolean => {
    console.log('🔧 usePromotionFormValidation - STARTING validation');
    console.log('🔧 usePromotionFormValidation - Input data:', data);
    
    const now = new Date();
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    console.log('🔧 usePromotionFormValidation - Date comparison:', {
      now: now.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: data.status
    });

    if (data.status === 'scheduled' && startDate <= now) {
      console.error('❌ usePromotionFormValidation - Scheduled promotion with past start date');
      toast({
        title: 'Erro de Validação',
        description: 'Promoções agendadas devem ter data de início no futuro',
        variant: 'destructive',
      });
      return false;
    }

    if (data.status === 'active' && (startDate > now || endDate < now)) {
      console.error('❌ usePromotionFormValidation - Active promotion outside valid period');
      toast({
        title: 'Erro de Validação',
        description: 'Promoções ativas devem estar dentro do período de validade',
        variant: 'destructive',
      });
      return false;
    }

    console.log('✅ usePromotionFormValidation - Validation passed');
    return true;
  };

  const prepareSubmissionData = (data: PromotionFormData) => {
    console.log('🔧 usePromotionFormValidation - STARTING data preparation');
    console.log('🔧 usePromotionFormValidation - Input data:', data);

    const productIds = Array.isArray(data.product_ids) ? data.product_ids : [];
    const categoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];

    console.log('🔧 usePromotionFormValidation - Processed arrays:', {
      productIds,
      categoryIds,
      promotionType: data.promotion_type,
      usageLimit: data.usage_limit
    });

    const result = {
      name: data.name,
      description: data.description || null,
      promotion_type: data.promotion_type,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
      product_ids: data.promotion_type === 'product' ? productIds : [],
      category_ids: data.promotion_type === 'category' ? categoryIds : [],
      minimum_purchase_amount: data.minimum_purchase_amount || 0,
      usage_limit: data.usage_limit || null,
      usage_limit_per_customer: data.usage_limit_per_customer || 1,
      priority: data.priority,
      status: data.status,
    };

    console.log('🔧 usePromotionFormValidation - Final prepared data:', result);
    return result;
  };

  return {
    validateSubmissionData,
    prepareSubmissionData,
  };
}
