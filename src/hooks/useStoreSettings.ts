
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
    queryFn: () => services?.storeSettingsService.getStoreSettingsWithDefaults() || null,
    enabled: !!services,
  });

  const updateMutation = useMutation({
    mutationFn: (settings: StoreSettingsUpdate) => {
      if (!services) throw new Error('Services not available');
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
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    storeSettings,
    isLoading,
    error,
    updateStoreSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
