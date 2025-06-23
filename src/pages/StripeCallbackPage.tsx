
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StripeOAuthService } from '@/services/StripeOAuthService';

export default function StripeCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

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
        const stripeOAuthService = new StripeOAuthService();
        const result = await stripeOAuthService.handleCallback(code, state);

        if (result.success) {
          setStatus('success');
          setMessage(result.message);
          
          toast({
            title: 'Conexão estabelecida',
            description: result.message,
          });

          // Redirect to store settings after 2 seconds
          setTimeout(() => {
            navigate('/admin/store-settings');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        setMessage(`Erro ao processar callback: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    processCallback();
  }, [searchParams, navigate, toast]);

  const handleRetry = () => {
    navigate('/admin/store-settings');
  };

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
                Redirecionando para as configurações da loja...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">
                  {message}
                </p>
              </div>
              <Button onClick={handleRetry} className="w-full">
                Voltar às Configurações
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
