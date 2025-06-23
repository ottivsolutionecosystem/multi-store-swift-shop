
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

export default function CentralStripeCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      console.log('Central callback processing:', { code: !!code, state: !!state, error });

      // Handle OAuth errors
      if (error) {
        setStatus('error');
        setMessage(`Erro na autorização: ${error}`);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        setMessage('Parâmetros de callback inválidos.');
        return;
      }

      try {
        // Decode state to get return URL
        const stateData = JSON.parse(atob(state));
        const returnTo = stateData.returnTo;

        console.log('Processing callback for return to:', returnTo);

        // Call the callback edge function
        const { data, error: callbackError } = await supabaseClient.functions.invoke('stripe-oauth-callback', {
          body: { code, state }
        });

        if (callbackError) {
          throw new Error(callbackError.message);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.success) {
          setStatus('success');
          setMessage('Conexão estabelecida com sucesso!');
          
          // Redirect back to the store with success parameter
          const redirectUrl = new URL(returnTo);
          redirectUrl.searchParams.set('stripe', 'connected');
          redirectUrl.searchParams.set('stripe_user_id', data.stripe_user_id);
          redirectUrl.searchParams.set('connection_status', data.connection_status);
          
          console.log('Redirecting to:', redirectUrl.toString());
          
          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = redirectUrl.toString();
          }, 2000);
        } else {
          throw new Error('Resposta inesperada do servidor');
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        setMessage(`Erro ao processar callback: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'processing' && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
            
            {status === 'processing' && 'Processando Conexão'}
            {status === 'success' && 'Conexão Estabelecida'}
            {status === 'error' && 'Erro na Conexão'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {status === 'processing' && 'Finalizando a conexão com o Stripe...'}
            {message}
          </p>

          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">
                Redirecionando de volta para sua loja...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                {message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
