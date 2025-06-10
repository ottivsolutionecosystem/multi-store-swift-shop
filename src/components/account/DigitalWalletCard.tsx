
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star, Edit, Trash2 } from 'lucide-react';
import { DigitalWalletCard } from '@/types/digital-wallet';

interface DigitalWalletCardProps {
  card: DigitalWalletCard;
  onSetDefault: (cardId: string) => void;
  onEdit: (card: DigitalWalletCard) => void;
  onRemove: (cardId: string) => void;
}

export function DigitalWalletCardComponent({ card, onSetDefault, onEdit, onRemove }: DigitalWalletCardProps) {
  const getDigitalWalletCardDisplay = (card: DigitalWalletCard) => {
    return {
      title: `${card.provider?.toUpperCase() || 'Cartão'} •••• ${card.lastFourDigits}`,
      subtitle: card.cardholderName || 'Nome não informado'
    };
  };

  const display = getDigitalWalletCardDisplay(card);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-4 w-4" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{display.title}</span>
            {card.isDefault && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                Padrão
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{display.subtitle}</p>
          <p className="text-xs text-gray-400">
            {card.type === 'credit_card' ? 'Crédito' : 'Débito'} • 
            Exp: {card.expiryMonth?.toString().padStart(2, '0')}/{card.expiryYear}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {!card.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(card.id)}
          >
            Definir como padrão
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(card)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(card.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
