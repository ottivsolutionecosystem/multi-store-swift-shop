
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Unlink, Clock, AlertTriangle } from 'lucide-react';
import { useStripeConnect } from '@/hooks/useStripeConnect';

interface StripeConnectCardProps {
  isConnected: boolean;
  stripeUserId?: string;
  connectDate?: string;
}

export function StripeConnectCard({ isConnected, stripeUserId, connectDate }: StripeConnectCardProps) {
  const { 
    connectToStripe, 
    disconnectFromStripe, 
    isConnecting, 
    isDisconnecting,
    accountStatus,
    isCheckingStatus
  } = useStripeConnect();

  const handleConnect = () => {
    connectToStripe();
  };

  const handleDisconnect = () => {
    disconnectFromStripe();
  };

  // Determine status based on account status from API
  const actuallyConnected = accountStatus?.connected || isConnected;
  const hasAccount = !!stripeUserId || !!accountStatus?.account_id;
  const needsOnboarding = hasAccount && !actuallyConnected;

  let statusIcon = <AlertCircle className="h-5 w-5 text-orange-500" />;
  let statusBadge = <Badge variant="secondary">Não Conectado</Badge>;
  let statusMessage = "⚠️ Conecte sua conta Stripe para começar a receber pagamentos.";

  if (isCheckingStatus) {
    statusIcon = <Clock className="h-5 w-5 text-blue-500" />;
    statusBadge = <Badge variant="outline">Verificando...</Badge>;
    statusMessage = "🔄 Verificando status da conta...";
  } else if (actuallyConnected) {
    statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
    statusBadge = <Badge variant="default">Conectado</Badge>;
    statusMessage = "✅ Sua conta Stripe está conectada e pronta para receber pagamentos.";
  } else if (needsOnboarding) {
    statusIcon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    statusBadge = <Badge variant="outline">Onboarding Pendente</Badge>;
    statusMessage = "⏳ Sua conta Stripe foi criada, mas o processo de onboarding ainda não foi concluído.";
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
          <p>{statusMessage}</p>
          
          {(stripeUserId || accountStatus?.account_id) && (
            <p className="font-mono text-xs bg-gray-50 p-2 rounded mt-2">
              Conta: {stripeUserId || accountStatus?.account_id}
            </p>
          )}
          
          {connectDate && (
            <p className="text-xs text-gray-500 mt-1">
              Conectado em: {new Date(connectDate).toLocaleDateString('pt-BR')}
            </p>
          )}

          {accountStatus && !actuallyConnected && accountStatus.requirements && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-medium text-yellow-800">Pendências:</p>
              <ul className="list-disc list-inside text-yellow-700">
                {accountStatus.requirements.currently_due?.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {actuallyConnected ? (
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
              {isConnecting ? 'Conectando...' : needsOnboarding ? 'Continuar Onboarding' : 'Conectar com Stripe'}
            </Button>
          )}
        </div>

        {actuallyConnected && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-1">Métodos de Pagamento Disponíveis:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Cartões de Crédito/Débito (Visa, Mastercard, etc.)</li>
              <li>• PIX (Pagamento instantâneo)</li>
              <li>• Apple Pay e Google Pay</li>
              <li>• Transferência Bancária</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
