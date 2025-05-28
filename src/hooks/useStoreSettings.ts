
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '@/hooks/useServices';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
type StoreSettingsUpdate = Database['public']['Tables']['store_settings']['Update'];

export function useStoreSettings() {
  const services = useServices();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: storeSettings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      if (!services) return null;
      return services.storeSettingsService.getStoreSettingsWithDefaults();
    },
    enabled: !!services,
  });

  const updateMutation = useMutation({
    mutationFn: async (settings: StoreSettingsUpdate) => {
      if (!services) {
        throw new Error('Services not available');
      }
      return services.storeSettingsService.updateStoreSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
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
    storeSettings,
    isLoading: isLoading || !services,
    error,
    updateStoreSettings: (settings: StoreSettingsUpdate) => {
      if (!services) {
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
