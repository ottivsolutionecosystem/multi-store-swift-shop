
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';

export function usePromotionActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const services = useServices();

  const handleCreatePromotion = () => {
    navigate('/admin/promotions/new');
  };

  const handleEditPromotion = (id: string) => {
    navigate(`/admin/promotions/${id}/edit`);
  };

  const handleDeletePromotion = async (id: string, onSuccess: (id: string) => void) => {
    if (!services) return;

    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;

    try {
      await services.promotionService.deletePromotion(id);
      onSuccess(id);
      toast({
        title: 'Sucesso',
        description: 'Promoção excluída com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir promoção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir promoção',
        variant: 'destructive',
      });
    }
  };

  return {
    handleCreatePromotion,
    handleEditPromotion,
    handleDeletePromotion,
  };
}
