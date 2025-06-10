
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star, Edit, Trash2 } from 'lucide-react';
import { PaymentMethod } from '@/types/payment-method';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (methodId: string) => void;
  onEdit: (method: PaymentMethod) => void;
  onRemove: (methodId: string) => void;
}

export function PaymentMethodCard({ method, onSetDefault, onEdit, onRemove }: PaymentMethodCardProps) {
  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    return {
      title: `${method.provider?.toUpperCase() || 'Cartão'} •••• ${method.lastFourDigits}`,
      subtitle: method.cardholderName || 'Nome não informado'
    };
  };

  const display = getPaymentMethodDisplay(method);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-4 w-4" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{display.title}</span>
            {method.isDefault && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                Padrão
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{display.subtitle}</p>
          <p className="text-xs text-gray-400">
            {method.type === 'credit_card' ? 'Crédito' : 'Débito'} • 
            Exp: {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {!method.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(method.id)}
          >
            Definir como padrão
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(method)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(method.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
