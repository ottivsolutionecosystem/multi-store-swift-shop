
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PaymentMethod, PaymentMethodFormData } from '@/types/payment-method';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { LGPDConsentModal } from './LGPDConsentModal';
import { PaymentMethodForm } from './PaymentMethodForm';

interface PaymentMethodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMethod?: PaymentMethod | null;
  onSuccess: () => void;
}

export function PaymentMethodFormDialog({
  open,
  onOpenChange,
  editingMethod,
  onSuccess
}: PaymentMethodFormDialogProps) {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
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
    if (editingMethod) {
      setFormData({
        type: editingMethod.type,
        provider: editingMethod.provider || '',
        cardholderName: editingMethod.cardholderName || '',
        expiryMonth: editingMethod.expiryMonth || 1,
        expiryYear: editingMethod.expiryYear || new Date().getFullYear(),
        isDefault: editingMethod.isDefault
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
  }, [editingMethod, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMethod && !consentGiven) {
      setShowConsentModal(true);
      return;
    }

    if (!services) return;

    try {
      setLoading(true);
      
      if (editingMethod) {
        await services.paymentMethodService.updatePaymentMethod(editingMethod.id, formData);
        toast({
          title: 'Sucesso',
          description: 'Cartão atualizado na sua carteira',
        });
      } else {
        await services.paymentMethodService.addPaymentMethod(formData);
        toast({
          title: 'Sucesso',
          description: 'Cartão adicionado à sua carteira',
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving payment method:', error);
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
              {editingMethod ? 'Editar' : 'Adicionar'} Cartão
            </DialogTitle>
            <DialogDescription>
              {editingMethod ? 'Atualize as informações do seu cartão' : 'Adicione um novo cartão à sua carteira digital'}
            </DialogDescription>
          </DialogHeader>

          <PaymentMethodForm
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            isEditing={!!editingMethod}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
