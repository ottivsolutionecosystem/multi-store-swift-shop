
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';
import { StripeOAuthService } from '@/services/StripeOAuthService';

export function useStripeOAuth() {
  const { storeId } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const stripeOAuthService = new StripeOAuthService();

  // Query to get connection status
  const { data: connectionStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['stripe-oauth-status', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      return stripeOAuthService.getConnectionDetails(storeId);
    },
    enabled: !!storeId,
    refetchInterval: 30000, // Check status every 30 seconds
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!storeId) throw new Error('Store ID not available');
      return stripeOAuthService.initiateConnection(storeId);
    },
    onSuccess: (authUrl) => {
      setIsConnecting(true);
      // Redirect to Stripe OAuth page
      window.location.href = authUrl;
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
      if (!storeId) throw new Error('Store ID not available');
      return stripeOAuthService.disconnect(storeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-oauth-status', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['payment-settings', storeId] });
      
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

  // Check for success callback from central redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('stripe') === 'connected') {
      const stripeUserId = urlParams.get('stripe_user_id');
      const connectionStatus = urlParams.get('connection_status');
      
      setIsConnecting(false);
      
      toast({
        title: 'Conexão estabelecida',
        description: `Sua conta Stripe foi conectada com sucesso! ${connectionStatus === 'pending' ? 'Complete o onboarding no Stripe Dashboard.' : ''}`,
      });
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('stripe');
      newUrl.searchParams.delete('stripe_user_id');
      newUrl.searchParams.delete('connection_status');
      window.history.replaceState({}, document.title, newUrl.toString());
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['stripe-oauth-status', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['payment-settings', storeId] });
    }
  }, [toast, queryClient, storeId]);

  return {
    // Actions
    connectToStripe: connectMutation.mutate,
    disconnectFromStripe: disconnectMutation.mutate,
    
    // State
    isConnecting: isConnecting || connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    isCheckingStatus,
    
    // Connection details
    connectionStatus: connectionStatus || {
      connected: false,
      canProcessPayments: false,
      validationMessage: 'Not connected'
    },
    
    // Computed values
    isConnected: connectionStatus?.connected || false,
    canProcessPayments: connectionStatus?.canProcessPayments || false,
    accountId: connectionStatus?.accountId,
    connectedAt: connectionStatus?.connectedAt,
  };
}
