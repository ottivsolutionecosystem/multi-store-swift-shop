
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '@/hooks/useServices';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

type StoreSettingsUpdate = Database['public']['Tables']['store_settings']['Update'];

export function useStoreSettingsUpdate() {
  const services = useServices();
  const { storeId } = useTenant();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (settings: StoreSettingsUpdate) => {
      console.log('useStoreSettingsUpdate - updating settings:', settings);
      
      // Verificar se usuário é admin
      if (!profile || profile.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem atualizar configurações.');
      }

      if (!services || !storeId) {
        throw new Error('Serviços ou ID da loja não disponível');
      }
      
      // Garantir associação do usuário com a loja antes de atualizar
      await services.profileService.ensureUserStoreAssociation(storeId);
      
      return services.storeSettingsService.updateStoreSettings(settings);
    },
    onSuccess: () => {
      console.log('useStoreSettingsUpdate - settings updated successfully');
      
      // Invalidar cache do tenant para propagar mudanças por toda a aplicação
      queryClient.invalidateQueries({ queryKey: ['current-store'] });
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações da loja foram atualizadas com sucesso.',
      });
    },
    onError: (error: Error) => {
      console.error('Error updating store settings:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    updateStoreSettings: (settings: StoreSettingsUpdate) => {
      if (!profile || profile.role !== 'admin') {
        toast({
          title: 'Acesso negado',
          description: 'Apenas administradores podem atualizar configurações.',
          variant: 'destructive',
        });
        return;
      }

      if (!services || !storeId) {
        toast({
          title: 'Erro',
          description: 'Serviços ainda não estão disponíveis. Tente novamente em alguns segundos.',
          variant: 'destructive',
        });
        return;
      }
      
      updateMutation.mutate(settings);
    },
    isUpdating: updateMutation.isPending,
  };
}
