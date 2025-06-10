
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';
import { Database } from '@/integrations/supabase/types';
import { useMemo, useEffect } from 'react';

type Promotion = Database['public']['Tables']['promotions']['Row'];

export function usePromotionData() {
  const services = useServices();
  const { toast } = useToast();

  const { 
    data: promotions = [], 
    isLoading: isLoadingPromotions,
    error
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      if (!services?.promotionService) {
        throw new Error('Promotion service not available');
      }
      return services.promotionService.getAllPromotions();
    },
    enabled: !!services?.promotionService,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Handle errors through useEffect
  useEffect(() => {
    if (error) {
      console.error('Erro ao carregar promoções:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar promoções',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const stats = useMemo(() => {
    if (!promotions.length) {
      return {
        active: 0,
        scheduled: 0,
        totalSavings: 0
      };
    }

    const activeCount = promotions.filter(p => p.status === 'active').length;
    const scheduledCount = promotions.filter(p => p.status === 'scheduled').length;

    return {
      active: activeCount,
      scheduled: scheduledCount,
      totalSavings: 0 // This would need order data to calculate properly
    };
  }, [promotions]);

  const removePromotion = (id: string) => {
    // This will be handled by React Query invalidation in the actual delete mutation
    console.log('Promotion removed:', id);
  };

  return {
    promotions,
    isLoadingPromotions,
    stats,
    removePromotion,
    error
  };
}
