
import { useMutation } from '@tanstack/react-query';
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
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (settings: StoreSettingsUpdate) => {
      console.log('useStoreSettingsUpdate - START updating settings:', settings);
      
      // Verificar se usuário é admin
      if (!profile || profile.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem atualizar configurações.');
      }

      if (!services || !storeId) {
        throw new Error('Serviços ou ID da loja não disponível');
      }
      
      console.log('useStoreSettingsUpdate - calling service to update settings');
      const updatedSettings = await services.storeSettingsService.updateStoreSettings(settings);
      console.log('useStoreSettingsUpdate - settings updated successfully:', updatedSettings);
      
      return updatedSettings;
    },
    onSuccess: () => {
      console.log('useStoreSettingsUpdate - mutation success, no propagation');
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações da loja foram atualizadas com sucesso. Recarregue a página para ver as mudanças.',
      });
    },
    onError: (error: Error) => {
      console.error('useStoreSettingsUpdate - mutation error:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    updateStoreSettings: (settings: StoreSettingsUpdate) => {
      console.log('useStoreSettingsUpdate - START updateStoreSettings function');
      
      if (!profile || profile.role !== 'admin') {
        console.error('useStoreSettingsUpdate - access denied, user is not admin');
        toast({
          title: 'Acesso negado',
          description: 'Apenas administradores podem atualizar configurações.',
          variant: 'destructive',
        });
        return;
      }

      if (!services || !storeId) {
        console.error('useStoreSettingsUpdate - services not available');
        toast({
          title: 'Erro',
          description: 'Serviços ainda não estão disponíveis. Tente novamente em alguns segundos.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('useStoreSettingsUpdate - triggering mutation');
      updateMutation.mutate(settings);
    },
    isUpdating: updateMutation.isPending,
  };
}
