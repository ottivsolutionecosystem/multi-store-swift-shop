
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';
import { Database } from '@/integrations/supabase/types';

type Promotion = Database['public']['Tables']['promotions']['Row'];

export function usePromotionData() {
  const services = useServices();
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    scheduled: 0,
    totalSavings: 0
  });

  useEffect(() => {
    const loadPromotions = async () => {
      if (!services) return;

      try {
        const promotionsData = await services.promotionService.getAllPromotions();
        setPromotions(promotionsData);

        // Calculate stats usando o campo status
        const activeCount = promotionsData.filter(p => p.status === 'active').length;
        const scheduledCount = promotionsData.filter(p => p.status === 'scheduled').length;

        setStats({
          active: activeCount,
          scheduled: scheduledCount,
          totalSavings: 0 // This would need order data to calculate properly
        });
      } catch (error) {
        console.error('Erro ao carregar promoções:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar promoções',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    loadPromotions();
  }, [services, toast]);

  const removePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  return {
    promotions,
    isLoadingPromotions,
    stats,
    removePromotion,
  };
}
