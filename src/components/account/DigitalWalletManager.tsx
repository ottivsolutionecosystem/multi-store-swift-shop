
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { DigitalWalletFormDialog } from './DigitalWalletFormDialog';
import { DigitalWalletCardComponent } from './DigitalWalletCard';
import { DigitalWalletEmptyState } from './DigitalWalletEmptyState';
import { DigitalWalletSecurityInfo } from './DigitalWalletSecurityInfo';
import { DigitalWalletCard } from '@/types/digital-wallet';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';

export function DigitalWalletManager() {
  const [digitalWalletCards, setDigitalWalletCards] = useState<DigitalWalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<DigitalWalletCard | null>(null);
  const services = useServices();
  const { toast } = useToast();

  const loadDigitalWalletCards = async () => {
    if (!services) return;
    
    try {
      setLoading(true);
      const cards = await services.digitalWalletService.getDigitalWalletCards();
      setDigitalWalletCards(cards);
    } catch (error) {
      console.error('Error loading digital wallet cards:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar cartões salvos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDigitalWalletCards();
  }, [services]);

  const handleSetDefault = async (cardId: string) => {
    if (!services) return;
    
    try {
      await services.digitalWalletService.setDefaultDigitalWalletCard(cardId);
      await loadDigitalWalletCards();
      toast({
        title: 'Sucesso',
        description: 'Cartão padrão atualizado',
      });
    } catch (error) {
      console.error('Error setting default digital wallet card:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir cartão padrão',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (cardId: string) => {
    if (!services) return;
    
    try {
      await services.digitalWalletService.removeDigitalWalletCard(cardId);
      await loadDigitalWalletCards();
      toast({
        title: 'Sucesso',
        description: 'Cartão removido da carteira',
      });
    } catch (error) {
      console.error('Error removing digital wallet card:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover cartão',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (card: DigitalWalletCard) => {
    setEditingCard(card);
    setDialogOpen(true);
  };

  const handleAddCard = () => {
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    loadDigitalWalletCards();
    setDialogOpen(false);
    setEditingCard(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Carteira Digital</span>
              </CardTitle>
              <CardDescription>
                Seus cartões salvos para compras mais rápidas e seguras
              </CardDescription>
            </div>
            <Button onClick={handleAddCard}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {digitalWalletCards.length === 0 ? (
            <DigitalWalletEmptyState onAddCard={handleAddCard} />
          ) : (
            <div className="space-y-4">
              {digitalWalletCards.map((card) => (
                <DigitalWalletCardComponent
                  key={card.id}
                  card={card}
                  onSetDefault={handleSetDefault}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
          
          <DigitalWalletSecurityInfo />
        </CardContent>
      </Card>

      <DigitalWalletFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCard={editingCard}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
}
