
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Unlink, Clock, Shield, Info } from 'lucide-react';
import { useStripeOAuth } from '@/hooks/useStripeOAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StripeOAuthCard() {
  const { 
    connectToStripe,
    disconnectFromStripe,
    isConnecting,
    isDisconnecting,
    isCheckingStatus,
    connectionStatus,
    isConnected,
    canProcessPayments,
    accountId,
    connectedAt
  } = useStripeOAuth();

  const handleConnect = () => {
    connectToStripe();
  };

  const handleDisconnect = () => {
    if (window.confirm('Tem certeza que deseja desconectar sua conta Stripe? Isso impedirá o processamento de pagamentos.')) {
      disconnectFromStripe();
    }
  };

  // Determine status display
  let statusIcon = <AlertCircle className="h-5 w-5 text-orange-500" />;
  let statusBadge = <Badge variant="secondary">Não Conectado</Badge>;
  let statusMessage = "Conecte sua conta Stripe para começar a receber pagamentos diretamente.";

  if (isCheckingStatus) {
    statusIcon = <Clock className="h-5 w-5 text-blue-500" />;
    statusBadge = <Badge variant="outline">Verificando...</Badge>;
    statusMessage = "Verificando status da conexão com o Stripe...";
  } else if (isConnected && canProcessPayments) {
    statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
    statusBadge = <Badge variant="default" className="bg-green-600">Conectado</Badge>;
    statusMessage = "Sua conta Stripe está conectada e pronta para processar pagamentos!";
  } else if (isConnected && !canProcessPayments) {
    statusIcon = <Shield className="h-5 w-5 text-yellow-500" />;
    statusBadge = <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendente</Badge>;
    statusMessage = "Conta conectada, mas ainda requer configuração adicional no Stripe Dashboard.";
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Stripe Connect
            {statusIcon}
          </CardTitle>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-3">{statusMessage}</p>
          
          {accountId && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-gray-700 mb-1">Detalhes da Conta:</p>
              <p className="font-mono text-xs text-gray-600">ID: {accountId}</p>
              {connectedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Conectado em: {new Date(connectedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}

          {connectionStatus.validationMessage && !canProcessPayments && (
            <Alert className="mt-3">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Status:</strong> {connectionStatus.validationMessage}
              </AlertDescription>
            </Alert>
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
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">✅ Recursos Disponíveis:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Processamento direto de pagamentos</li>
              <li>• Recebimento na sua conta Stripe</li>
              <li>• Controle total sobre transações</li>
              <li>• Dashboard completo no Stripe</li>
            </ul>
          </div>
        )}

        {isConnected && !canProcessPayments && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-2">⏳ Próximos Passos:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Acesse seu <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a></li>
              <li>• Complete as informações da conta</li>
              <li>• Verifique os documentos necessários</li>
              <li>• Ative o processamento de pagamentos</li>
            </ul>
          </div>
        )}

        {!isConnected && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">ℹ️ Como Funciona:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Clique em "Conectar com Stripe"</li>
              <li>• Faça login na sua conta Stripe</li>
              <li>• Autorize a conexão com a plataforma</li>
              <li>• Comece a receber pagamentos imediatamente</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
