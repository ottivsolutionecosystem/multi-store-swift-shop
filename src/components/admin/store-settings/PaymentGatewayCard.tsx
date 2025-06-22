
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Settings, Trash2, Star, Check, AlertCircle } from 'lucide-react';
import { PaymentGatewayConfig } from '@/types/payment-gateway';
import { PaymentGatewayType } from '@/interfaces/PaymentProvider';
import { StripeConnectCard } from './StripeConnectCard';
import { useTenant } from '@/contexts/TenantContext';

interface PaymentGatewayCardProps {
  gateway: PaymentGatewayConfig;
  onUpdate: (updates: Partial<PaymentGatewayConfig>) => void;
  onDelete: () => void;
  onEdit: () => void;
  isDefault: boolean;
  onSetDefault: () => void;
}

export function PaymentGatewayCard({
  gateway,
  onUpdate,
  onDelete,
  onEdit,
  isDefault,
  onSetDefault
}: PaymentGatewayCardProps) {
  const { store } = useTenant();
  
  // For Stripe, show the Stripe Connect card instead of the generic gateway card
  if (gateway.type === PaymentGatewayType.STRIPE) {
    const storeSettings = store?.store_settings;
    return (
      <StripeConnectCard
        isConnected={!!storeSettings?.stripe_connected}
        stripeUserId={storeSettings?.stripe_user_id || undefined}
        connectDate={storeSettings?.stripe_connect_date || undefined}
      />
    );
  }

  // For other gateways, show the original card (MercadoPago, etc.)
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{gateway.name}</CardTitle>
            {isDefault && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={gateway.enabled ? 'default' : 'secondary'}>
              {gateway.enabled ? 'Ativo' : 'Inativo'}
            </Badge>
            <Badge variant={gateway.testMode ? 'outline' : 'default'}>
              {gateway.testMode ? 'Teste' : 'Produção'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </DropdownMenuItem>
                {!isDefault && gateway.enabled && (
                  <DropdownMenuItem onClick={onSetDefault}>
                    <Star className="h-4 w-4 mr-2" />
                    Definir como Padrão
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Gateway Habilitado</span>
          <Switch
            checked={gateway.enabled}
            onCheckedChange={(enabled) => onUpdate({ enabled })}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Modo de Teste</span>
          <Switch
            checked={gateway.testMode}
            onCheckedChange={(testMode) => onUpdate({ testMode })}
          />
        </div>

        {gateway.webhookUrl && (
          <div>
            <label className="text-sm font-medium">Webhook URL</label>
            <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
              {gateway.webhookUrl}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Settings className="h-4 w-4 mr-1" />
            Configurar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
