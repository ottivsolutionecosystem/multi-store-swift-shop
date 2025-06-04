
import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { usePromotionFormValidation } from './usePromotionFormValidation';
import { PromotionFormData } from '@/types/promotion';

interface UsePromotionFormSubmissionProps {
  promotionId?: string;
  onSuccess: () => void;
}

export function usePromotionFormSubmission({ promotionId, onSuccess }: UsePromotionFormSubmissionProps) {
  const services = useServices();
  const { toast } = useToast();
  const { validateSubmissionData, prepareSubmissionData } = usePromotionFormValidation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PromotionFormData) => {
    if (!services) return;

    console.log('🔧 usePromotionFormSubmission - Form submission started:', data);
    
    setIsLoading(true);
    
    try {
      if (!validateSubmissionData(data)) {
        return;
      }

      const promotionData = prepareSubmissionData(data);
      console.log('🔧 usePromotionFormSubmission - Sending to service:', promotionData);

      if (promotionId) {
        await services.promotionService.updatePromotion(promotionId, promotionData);
        toast({
          title: 'Sucesso',
          description: 'Promoção atualizada com sucesso!',
        });
      } else {
        await services.promotionService.createPromotion(promotionData);
        toast({
          title: 'Sucesso',
          description: 'Promoção criada com sucesso!',
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('❌ usePromotionFormSubmission - Submission error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar promoção',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
  };
}
