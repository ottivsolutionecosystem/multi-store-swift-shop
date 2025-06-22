
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentGatewayType } from '@/interfaces/PaymentProvider';
import { PaymentServiceFactory } from '@/factories/PaymentServiceFactory';
import { CreditCard, Zap } from 'lucide-react';

interface PaymentGatewayFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableTypes: PaymentGatewayType[];
  onSave: (type: PaymentGatewayType) => void;
}

export function PaymentGatewayFormDialog({
  open,
  onOpenChange,
  availableTypes,
  onSave
}: PaymentGatewayFormDialogProps) {
  const getGatewayIcon = (type: PaymentGatewayType) => {
    switch (type) {
      case PaymentGatewayType.STRIPE:
        return <CreditCard className="h-8 w-8 text-blue-600" />;
      case PaymentGatewayType.MERCADO_PAGO:
        return <Zap className="h-8 w-8 text-blue-500" />;
      default:
        return <CreditCard className="h-8 w-8 text-gray-500" />;
    }
  };

  const getGatewayDescription = (type: PaymentGatewayType) => {
    switch (type) {
      case PaymentGatewayType.STRIPE:
        return 'Gateway global com suporte a cartões de crédito e wallets digitais';
      case PaymentGatewayType.MERCADO_PAGO:
        return 'Gateway brasileiro com PIX, cartões e boleto bancário';
      default:
        return 'Gateway de pagamento';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Gateway de Pagamento</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {availableTypes.map((type) => {
            const provider = PaymentServiceFactory.getProvider(type);
            
            return (
              <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {getGatewayIcon(type)}
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {getGatewayDescription(type)}
                  </CardDescription>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Métodos suportados:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.getAvailableMethods().slice(0, 3).map((method) => (
                        <span
                          key={method.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {method.name}
                        </span>
                      ))}
                      {provider.getAvailableMethods().length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{provider.getAvailableMethods().length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onSave(type)}
                    className="w-full"
                  >
                    Adicionar {provider.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {availableTypes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Todos os gateways disponíveis já foram adicionados</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
