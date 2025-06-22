
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Unlink } from 'lucide-react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { StripePaymentProvider } from '@/providers/StripePaymentProvider';
import { useTenant } from '@/contexts/TenantContext';

interface StripeConnectCardProps {
  isConnected: boolean;
  stripeUserId?: string;
  connectDate?: string;
}

export function StripeConnectCard({ isConnected, stripeUserId, connectDate }: StripeConnectCardProps) {
  const { storeId } = useTenant();
  const { connectToStripe, disconnectFromStripe, isConnecting, isDisconnecting } = useStripeConnect();
  const stripeProvider = new StripePaymentProvider();

  const handleConnect = () => {
    if (!storeId) return;
    
    const connectUrl = stripeProvider.generateConnectUrl(storeId);
    connectToStripe(connectUrl);
  };

  const handleDisconnect = () => {
    disconnectFromStripe();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Stripe Connect
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
          </CardTitle>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Conectado' : 'Não Conectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          {isConnected ? (
            <div className="space-y-2">
              <p>✅ Sua conta Stripe está conectada e pronta para receber pagamentos.</p>
              {stripeUserId && (
                <p className="font-mono text-xs bg-gray-50 p-2 rounded">
                  Conta: {stripeUserId}
                </p>
              )}
              {connectDate && (
                <p className="text-xs text-gray-500">
                  Conectado em: {new Date(connectDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p>⚠️ Conecte sua conta Stripe para começar a receber pagamentos.</p>
              <p className="text-xs">
                Você será redirecionado para o Stripe para autorizar a conexão de forma segura.
              </p>
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
              disabled={isConnecting || !storeId}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {isConnecting ? 'Conectando...' : 'Conectar com Stripe'}
            </Button>
          )}
        </div>

        {isConnected && (
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
