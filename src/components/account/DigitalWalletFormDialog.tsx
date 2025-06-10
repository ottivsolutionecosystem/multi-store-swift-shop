
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DigitalWalletCard, DigitalWalletCardFormData } from '@/types/digital-wallet';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { LGPDConsentModal } from './LGPDConsentModal';
import { DigitalWalletForm } from './DigitalWalletForm';

interface DigitalWalletFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCard?: DigitalWalletCard | null;
  onSuccess: () => void;
}

export function DigitalWalletFormDialog({
  open,
  onOpenChange,
  editingCard,
  onSuccess
}: DigitalWalletFormDialogProps) {
  const [formData, setFormData] = useState<DigitalWalletCardFormData>({
    type: 'credit_card',
    provider: '',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: 1,
    expiryYear: new Date().getFullYear(),
    isDefault: false
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const services = useServices();
  const { toast } = useToast();

  useEffect(() => {
    if (editingCard) {
      setFormData({
        type: editingCard.type,
        provider: editingCard.provider || '',
        cardholderName: editingCard.cardholderName || '',
        expiryMonth: editingCard.expiryMonth || 1,
        expiryYear: editingCard.expiryYear || new Date().getFullYear(),
        isDefault: editingCard.isDefault
      });
      setConsentGiven(true);
    } else {
      setFormData({
        type: 'credit_card',
        provider: '',
        cardNumber: '',
        cardholderName: '',
        expiryMonth: 1,
        expiryYear: new Date().getFullYear(),
        isDefault: false
      });
      setConsentGiven(false);
    }
  }, [editingCard, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCard && !consentGiven) {
      setShowConsentModal(true);
      return;
    }

    if (!services) return;

    try {
      setLoading(true);
      
      if (editingCard) {
        await services.digitalWalletService.updateDigitalWalletCard(editingCard.id, formData);
        toast({
          title: 'Sucesso',
          description: 'Cartão atualizado na sua carteira',
        });
      } else {
        await services.digitalWalletService.addDigitalWalletCard(formData);
        toast({
          title: 'Sucesso',
          description: 'Cartão adicionado à sua carteira',
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving digital wallet card:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar cartão',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsentContinue = () => {
    setShowConsentModal(false);
    setTimeout(() => handleSubmit(new Event('submit') as any), 100);
  };

  return (
    <>
      <LGPDConsentModal
        open={showConsentModal}
        onOpenChange={setShowConsentModal}
        consentGiven={consentGiven}
        setConsentGiven={setConsentGiven}
        onContinue={handleConsentContinue}
      />

      <Dialog open={open && !showConsentModal} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? 'Editar' : 'Adicionar'} Cartão
            </DialogTitle>
            <DialogDescription>
              {editingCard ? 'Atualize as informações do seu cartão' : 'Adicione um novo cartão à sua carteira digital'}
            </DialogDescription>
          </DialogHeader>

          <DigitalWalletForm
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            isEditing={!!editingCard}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
