
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '@/hooks/useServices';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';

type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
type StoreSettingsUpdate = Database['public']['Tables']['store_settings']['Update'];

export function useStoreSettings() {
  const services = useServices();
  const { storeId } = useTenant();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  console.log('useStoreSettings - services available:', !!services, 'storeId:', storeId);

  const {
    data: storeSettings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['store-settings', storeId],
    queryFn: async () => {
      console.log('useStoreSettings - fetching store settings...');
      if (!services || !storeId) {
        console.log('useStoreSettings - no services or storeId available, skipping');
        return null;
      }
      
      try {
        // Ensure user is associated with the store before fetching settings
        await services.profileService.ensureUserStoreAssociation(storeId);
        
        const settings = await services.storeSettingsService.getStoreSettingsWithDefaults();
        console.log('useStoreSettings - settings loaded:', settings);
        return settings;
      } catch (error) {
        console.error('useStoreSettings - error loading settings:', error);
        // Em caso de erro, retorna null em vez de throw para evitar loop
        return null;
      }
    },
    enabled: !!services && !!storeId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  const updateMutation = useMutation({
    mutationFn: async (settings: StoreSettingsUpdate) => {
      console.log('useStoreSettings - updating settings:', settings);
      if (!services || !storeId) {
        throw new Error('Services or store ID not available');
      }
      
      // Ensure user is associated with the store before updating
      await services.profileService.ensureUserStoreAssociation(storeId);
      
      return services.storeSettingsService.updateStoreSettings(settings);
    },
    onSuccess: () => {
      console.log('useStoreSettings - settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
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

  // Melhorar a lógica de isLoading para não ficar infinita
  const finalIsLoading = isLoading && !!services && !!storeId;

  return {
    storeSettings,
    isLoading: finalIsLoading,
    error,
    updateStoreSettings: (settings: StoreSettingsUpdate) => {
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
