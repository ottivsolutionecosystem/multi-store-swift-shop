
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface DigitalWalletEmptyStateProps {
  onAddCard: () => void;
}

export function DigitalWalletEmptyState({ onAddCard }: DigitalWalletEmptyStateProps) {
  return (
    <div className="text-center py-8">
      <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 mb-4">Nenhum cartão salvo na sua carteira</p>
      <p className="text-sm text-gray-400 mb-4">
        Salve seus cartões para fazer compras mais rapidamente
      </p>
      <Button onClick={onAddCard}>
        Adicionar primeiro cartão
      </Button>
    </div>
  );
}
