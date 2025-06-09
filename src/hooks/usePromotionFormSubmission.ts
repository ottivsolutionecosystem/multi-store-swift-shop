
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
    console.log('🔧 usePromotionFormSubmission - Form submission STARTED');
    console.log('🔧 usePromotionFormSubmission - Raw form data:', data);
    console.log('🔧 usePromotionFormSubmission - Services available:', !!services);
    console.log('🔧 usePromotionFormSubmission - Promotion type:', data.promotion_type);
    
    if (!services) {
      console.error('❌ usePromotionFormSubmission - Services not available');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔧 usePromotionFormSubmission - Starting validation...');
      if (!validateSubmissionData(data)) {
        console.error('❌ usePromotionFormSubmission - Validation failed');
        return;
      }
      console.log('✅ usePromotionFormSubmission - Validation passed');

      const promotionData = prepareSubmissionData(data);
      console.log('🔧 usePromotionFormSubmission - Prepared data for service:', promotionData);
      console.log('🔧 usePromotionFormSubmission - Promotion type in prepared data:', promotionData.promotion_type);

      if (promotionId) {
        console.log('🔧 usePromotionFormSubmission - Updating existing promotion:', promotionId);
        await services.promotionService.updatePromotion(promotionId, promotionData);
        console.log('✅ usePromotionFormSubmission - Update successful');
        toast({
          title: 'Sucesso',
          description: 'Promoção atualizada com sucesso!',
        });
      } else {
        console.log('🔧 usePromotionFormSubmission - Creating new promotion...');
        console.log('🔧 usePromotionFormSubmission - Calling promotionService.createPromotion with:', promotionData);
        
        const result = await services.promotionService.createPromotion(promotionData);
        console.log('✅ usePromotionFormSubmission - Creation successful, result:', result);
        
        toast({
          title: 'Sucesso',
          description: 'Promoção criada com sucesso!',
        });
      }

      console.log('🔧 usePromotionFormSubmission - Calling onSuccess...');
      onSuccess();
      console.log('✅ usePromotionFormSubmission - Process completed successfully');
    } catch (error: any) {
      console.error('❌ usePromotionFormSubmission - Error during submission:', error);
      console.error('❌ usePromotionFormSubmission - Error stack:', error.stack);
      console.error('❌ usePromotionFormSubmission - Error message:', error.message);
      
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar promoção',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      console.log('🔧 usePromotionFormSubmission - Loading state reset');
    }
  };

  return {
    onSubmit,
    isLoading,
  };
}
