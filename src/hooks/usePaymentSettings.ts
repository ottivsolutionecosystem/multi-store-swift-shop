
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentSettings } from '@/types/payment-gateway';
import { PaymentGatewayService } from '@/services/PaymentGatewayService';

export function usePaymentSettings() {
  const services = useServices();
  const { storeId } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const paymentGatewayService = new PaymentGatewayService();

  const {
    data: paymentSettings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['payment-settings', storeId],
    queryFn: async () => {
      console.log('usePaymentSettings - fetching payment settings...');
      if (!services || !storeId) {
        return null;
      }
      
      const storeSettings = await services.storeSettingsService.getStoreSettingsWithDefaults();
      
      // Extract payment settings from store settings
      const paymentSettings: PaymentSettings = {
        gateways: [],
        enabledMethods: [],
        ...((storeSettings.payment_settings as PaymentSettings) || {})
      };
      
      return paymentSettings;
    },
    enabled: !!services && !!storeId,
  });

  const updatePaymentSettings = useMutation({
    mutationFn: async (settings: PaymentSettings) => {
      console.log('usePaymentSettings - updating payment settings:', settings);
      
      if (!services || !storeId) {
        throw new Error('Services or store ID not available');
      }

      // Only validate if there are enabled gateways (allow saving during configuration)
      const enabledGateways = settings.gateways.filter(gateway => gateway.enabled);
      if (enabledGateways.length > 0) {
        const validation = paymentGatewayService.validatePaymentSettings(settings);
        if (!validation.valid) {
          throw new Error(`Configuração inválida: ${validation.errors.join(', ')}`);
        }
      }
      
      // Update store settings with new payment settings
      return services.storeSettingsService.updateStoreSettings({
        payment_settings: settings
      });
    },
    onSuccess: () => {
      console.log('usePaymentSettings - payment settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['payment-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
      
      toast({
        title: 'Configurações de pagamento salvas',
        description: 'As configurações foram atualizadas com sucesso.',
      });
    },
    onError: (error: Error) => {
      console.error('usePaymentSettings - error updating settings:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    paymentSettings,
    isLoading: isLoading || !services || !storeId,
    error,
    updatePaymentSettings: updatePaymentSettings.mutate,
    isUpdating: updatePaymentSettings.isPending,
    paymentGatewayService,
  };
}
