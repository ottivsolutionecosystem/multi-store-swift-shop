
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';
import { supabaseClient } from '@/lib/supabaseClient';

export function useStripeConnect() {
  const { storeId } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectToStripe = (connectUrl: string) => {
    setIsConnecting(true);

    // Open Stripe Connect in a popup window
    const popup = window.open(
      connectUrl,
      'stripe-connect',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'stripe_success') {
        setIsConnecting(false);
        popup?.close();
        
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['store-settings', storeId] });
        queryClient.invalidateQueries({ queryKey: ['payment-settings', storeId] });
        
        toast({
          title: 'Conexão estabelecida',
          description: 'Sua conta Stripe foi conectada com sucesso!',
        });
        
        window.removeEventListener('message', handleMessage);
      } else if (event.data.type === 'stripe_error') {
        setIsConnecting(false);
        popup?.close();
        
        toast({
          title: 'Erro na conexão',
          description: `Falha ao conectar com Stripe: ${event.data.error}`,
          variant: 'destructive',
        });
        
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        setIsConnecting(false);
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
  };

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

  return {
    connectToStripe,
    disconnectFromStripe: disconnectMutation.mutate,
    isConnecting,
    isDisconnecting: disconnectMutation.isPending,
  };
}
