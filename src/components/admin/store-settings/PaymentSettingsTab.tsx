
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';
import { PaymentGatewayCard } from './PaymentGatewayCard';
import { PaymentGatewayFormDialog } from './PaymentGatewayFormDialog';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentGatewayType } from '@/interfaces/PaymentProvider';
import { PaymentServiceFactory } from '@/factories/PaymentServiceFactory';

export function PaymentSettingsTab() {
  const { paymentSettings, isLoading, updatePaymentSettings, isUpdating } = usePaymentSettings();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingGateway, setEditingGateway] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleAddGateway = (type: PaymentGatewayType) => {
    const provider = PaymentServiceFactory.getProvider(type);
    const availableMethods = provider.getAvailableMethods();
    
    // Enable basic methods by default
    const defaultEnabledMethods = availableMethods
      .filter(method => ['credit_card', 'pix'].includes(method.type))
      .map(method => method.id);

    const newGateway = {
      id: `${type}_${Date.now()}`,
      name: provider.name,
      type,
      enabled: true, // Enable by default
      testMode: true,
      credentials: {},
      supportedMethods: availableMethods,
    };

    const currentEnabledMethods = paymentSettings?.enabledMethods || [];
    const updatedEnabledMethods = [...currentEnabledMethods, ...defaultEnabledMethods];

    const updatedSettings = {
      ...paymentSettings,
      gateways: [...(paymentSettings?.gateways || []), newGateway],
      enabledMethods: updatedEnabledMethods,
      // Set as default if it's the first gateway
      defaultGateway: paymentSettings?.gateways?.length === 0 ? newGateway.id : paymentSettings.defaultGateway
    };

    updatePaymentSettings(updatedSettings);
    setShowAddDialog(false);
  };

  const handleUpdateGateway = (gatewayId: string, updates: any) => {
    if (!paymentSettings) return;

    const updatedGateways = paymentSettings.gateways.map(gateway =>
      gateway.id === gatewayId ? { ...gateway, ...updates } : gateway
    );

    const updatedSettings = {
      ...paymentSettings,
      gateways: updatedGateways
    };

    updatePaymentSettings(updatedSettings);
  };

  const handleDeleteGateway = (gatewayId: string) => {
    if (!paymentSettings) return;

    const gatewayToDelete = paymentSettings.gateways.find(g => g.id === gatewayId);
    const updatedGateways = paymentSettings.gateways.filter(gateway => gateway.id !== gatewayId);
    
    // Remove methods from this gateway from enabled methods
    let updatedEnabledMethods = paymentSettings.enabledMethods;
    if (gatewayToDelete) {
      const gatewayMethodIds = gatewayToDelete.supportedMethods.map(m => m.id);
      updatedEnabledMethods = paymentSettings.enabledMethods.filter(
        methodId => !gatewayMethodIds.includes(methodId)
      );
    }
    
    const updatedSettings = {
      ...paymentSettings,
      gateways: updatedGateways,
      enabledMethods: updatedEnabledMethods,
      defaultGateway: paymentSettings.defaultGateway === gatewayId ? undefined : paymentSettings.defaultGateway
    };

    updatePaymentSettings(updatedSettings);
  };

  const handleMethodsChange = (enabledMethods: string[]) => {
    if (!paymentSettings) return;

    const updatedSettings = {
      ...paymentSettings,
      enabledMethods
    };

    updatePaymentSettings(updatedSettings);
  };

  const availableGatewayTypes = PaymentServiceFactory.getSupportedGatewayTypes()
    .filter(type => !paymentSettings?.gateways.some(gateway => gateway.type === type));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gateways de Pagamento</CardTitle>
          <CardDescription>
            Configure os provedores de pagamento para sua loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentSettings?.gateways.map((gateway) => (
              <PaymentGatewayCard
                key={gateway.id}
                gateway={gateway}
                onUpdate={(updates) => handleUpdateGateway(gateway.id, updates)}
                onDelete={() => handleDeleteGateway(gateway.id)}
                onEdit={() => setEditingGateway(gateway.id)}
                isDefault={paymentSettings.defaultGateway === gateway.id}
                onSetDefault={() => updatePaymentSettings({
                  ...paymentSettings,
                  defaultGateway: gateway.id
                })}
              />
            ))}
            
            {(!paymentSettings?.gateways || paymentSettings.gateways.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum gateway de pagamento configurado</p>
                <p className="text-sm">Adicione um gateway para começar a receber pagamentos</p>
              </div>
            )}
            
            {availableGatewayTypes.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(true)}
                className="w-full"
                disabled={isUpdating}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Gateway de Pagamento
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {paymentSettings?.gateways && paymentSettings.gateways.length > 0 && (
        <PaymentMethodSelector
          gateways={paymentSettings.gateways}
          enabledMethods={paymentSettings.enabledMethods}
          onMethodsChange={handleMethodsChange}
        />
      )}

      <PaymentGatewayFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        availableTypes={availableGatewayTypes}
        onSave={handleAddGateway}
      />
    </div>
  );
}
