
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';
import { supabaseClient } from '@/lib/supabaseClient';

export function useStripeConnect() {
  const { storeId } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  // Query to check account status
  const { data: accountStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['stripe-account-status', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      
      const { data, error } = await supabaseClient.functions.invoke('stripe-account-status');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!storeId,
    refetchInterval: 30000, // Check status every 30 seconds
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabaseClient.functions.invoke('stripe-create-account');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    onSuccess: (data) => {
      setIsConnecting(true);
      
      // Redirect to Stripe onboarding
      window.location.href = data.account_link_url;
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao conectar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabaseClient.functions.invoke('stripe-disconnect');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['payment-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['stripe-account-status', storeId] });
      
      toast({
        title: 'Conta desconectada',
        description: 'Sua conta Stripe foi desconectada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao desconectar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Check for URL parameters on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('stripe_success') === 'true') {
      setIsConnecting(false);
      
      toast({
        title: 'Conexão estabelecida',
        description: 'Sua conta Stripe foi conectada com sucesso!',
      });
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['payment-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['stripe-account-status', storeId] });
    }
    
    if (urlParams.get('stripe_refresh') === 'true') {
      setIsConnecting(false);
      
      toast({
        title: 'Processo interrompido',
        description: 'O processo de conexão foi interrompido. Tente novamente.',
        variant: 'destructive',
      });
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, queryClient, storeId]);

  return {
    connectToStripe: connectMutation.mutate,
    disconnectFromStripe: disconnectMutation.mutate,
    isConnecting: isConnecting || connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    accountStatus,
    isCheckingStatus,
  };
}
