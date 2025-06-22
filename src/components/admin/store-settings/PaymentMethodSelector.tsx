
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PaymentGatewayConfig } from '@/types/payment-gateway';
import { CreditCard, Zap, FileText, Building, Smartphone, Banknote } from 'lucide-react';
import { PaymentMethodType } from '@/interfaces/PaymentProvider';

interface PaymentMethodSelectorProps {
  gateways: PaymentGatewayConfig[];
  enabledMethods: string[];
  onMethodsChange: (enabledMethods: string[]) => void;
}

export function PaymentMethodSelector({
  gateways,
  enabledMethods,
  onMethodsChange
}: PaymentMethodSelectorProps) {
  const getMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        return <CreditCard className="h-4 w-4" />;
      case PaymentMethodType.PIX:
        return <Zap className="h-4 w-4" />;
      case PaymentMethodType.BOLETO:
        return <FileText className="h-4 w-4" />;
      case PaymentMethodType.BANK_TRANSFER:
        return <Building className="h-4 w-4" />;
      case PaymentMethodType.DIGITAL_WALLET:
        return <Smartphone className="h-4 w-4" />;
      case PaymentMethodType.CASH:
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Get all available methods from enabled gateways
  const availableMethods = gateways
    .filter(gateway => gateway.enabled)
    .flatMap(gateway => 
      gateway.supportedMethods.map(method => ({
        ...method,
        gatewayName: gateway.name,
        gatewayType: gateway.type
      }))
    );

  // Group methods by type to avoid duplicates
  const groupedMethods = availableMethods.reduce((acc, method) => {
    const existing = acc.find(m => m.type === method.type);
    if (existing) {
      existing.gateways.push({ name: method.gatewayName, type: method.gatewayType });
    } else {
      acc.push({
        ...method,
        gateways: [{ name: method.gatewayName, type: method.gatewayType }]
      });
    }
    return acc;
  }, [] as Array<any>);

  const handleMethodToggle = (methodId: string, checked: boolean) => {
    if (checked) {
      onMethodsChange([...enabledMethods, methodId]);
    } else {
      onMethodsChange(enabledMethods.filter(id => id !== methodId));
    }
  };

  const handleSelectAll = () => {
    const allMethodIds = groupedMethods.map(method => method.id);
    onMethodsChange(allMethodIds);
  };

  const handleSelectNone = () => {
    onMethodsChange([]);
  };

  if (availableMethods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>
            Configure quais métodos de pagamento serão exibidos no checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum método de pagamento disponível</p>
            <p className="text-sm">Habilite pelo menos um gateway de pagamento primeiro</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>
              Selecione quais métodos serão exibidos no checkout
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Selecionar Todos
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleSelectNone}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Desmarcar Todos
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Checkbox
                id={method.id}
                checked={enabledMethods.includes(method.id)}
                onCheckedChange={(checked) => handleMethodToggle(method.id, !!checked)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getMethodIcon(method.type)}
                  <label
                    htmlFor={method.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {method.name}
                  </label>
                </div>
                {method.description && (
                  <p className="text-xs text-gray-600 mb-2">{method.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {method.gateways.map((gateway: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {gateway.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
