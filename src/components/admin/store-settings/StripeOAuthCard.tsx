
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Unlink, Clock, Shield } from 'lucide-react';
import { useStripeOAuth } from '@/hooks/useStripeOAuth';

export function StripeOAuthCard() {
  const { 
    connectToStripe,
    disconnectFromStripe,
    handleOAuthCallback,
    isConnecting,
    isDisconnecting,
    isCheckingStatus,
    connectionStatus,
    isConnected,
    canProcessPayments,
    accountId,
    connectedAt
  } = useStripeOAuth();

  // Handle OAuth callback from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code, state);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handleOAuthCallback]);

  const handleConnect = () => {
    connectToStripe();
  };

  const handleDisconnect = () => {
    disconnectFromStripe();
  };

  // Determine status display
  let statusIcon = <AlertCircle className="h-5 w-5 text-orange-500" />;
  let statusBadge = <Badge variant="secondary">Não Conectado</Badge>;
  let statusMessage = "⚠️ Conecte sua conta Stripe para começar a receber pagamentos.";

  if (isCheckingStatus) {
    statusIcon = <Clock className="h-5 w-5 text-blue-500" />;
    statusBadge = <Badge variant="outline">Verificando...</Badge>;
    statusMessage = "🔄 Verificando status da conta...";
  } else if (isConnected && canProcessPayments) {
    statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
    statusBadge = <Badge variant="default">Conectado</Badge>;
    statusMessage = "✅ Sua conta Stripe está conectada e pronta para receber pagamentos.";
  } else if (isConnected && !canProcessPayments) {
    statusIcon = <Shield className="h-5 w-5 text-yellow-500" />;
    statusBadge = <Badge variant="outline">Configuração Pendente</Badge>;
    statusMessage = "⏳ Conta conectada, mas ainda não pode processar pagamentos. Verifique as configurações no Stripe.";
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Stripe Connect (OAuth)
            {statusIcon}
          </CardTitle>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>{statusMessage}</p>
          
          {accountId && (
            <p className="font-mono text-xs bg-gray-50 p-2 rounded mt-2">
              Conta: {accountId}
            </p>
          )}
          
          {connectedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Conectado em: {new Date(connectedAt).toLocaleDateString('pt-BR')}
            </p>
          )}

          {connectionStatus.validationMessage && !canProcessPayments && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-medium text-yellow-800">Status:</p>
              <p className="text-yellow-700">{connectionStatus.validationMessage}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isConnected ? (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="flex items-center gap-2"
            >
              <Unlink className="h-4 w-4" />
              {isDisconnecting ? 'Desconectando...' : 'Desconectar'}
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {isConnecting ? 'Conectando...' : 'Conectar com Stripe'}
            </Button>
          )}
        </div>

        {canProcessPayments && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-1">Recursos Disponíveis:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Processamento direto de pagamentos</li>
              <li>• Recebimento direto na sua conta Stripe</li>
              <li>• Sem taxas da plataforma</li>
              <li>• Controle total sobre transações</li>
              <li>• Integração com checkout personalizado</li>
            </ul>
          </div>
        )}

        {isConnected && !canProcessPayments && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-1">Próximos Passos:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Complete as informações da conta no Stripe</li>
              <li>• Verifique os documentos necessários</li>
              <li>• Confirme as configurações de pagamento</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
