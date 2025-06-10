
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Shield } from 'lucide-react';
import { PaymentMethod, PaymentMethodFormData } from '@/types/payment-method';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';

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
      setConsentGiven(true); // Already consented for existing methods
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

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (showConsentModal) {
    return (
      <Dialog open={showConsentModal} onOpenChange={setShowConsentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Consentimento LGPD</span>
            </DialogTitle>
            <DialogDescription>
              Para salvar seu cartão na carteira digital, precisamos do seu consentimento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como protegemos seus dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Dados coletados:</strong> Apenas os últimos 4 dígitos do cartão, nome do portador e validade.</p>
                  <p><strong>Finalidade:</strong> Facilitar futuras compras com checkout mais rápido.</p>
                  <p><strong>Armazenamento:</strong> Dados criptografados e seguros em nossos servidores.</p>
                  <p><strong>Retenção:</strong> Mantemos os dados por 1 ano ou até você solicitar a remoção.</p>
                  <p><strong>Seus direitos:</strong> Você pode acessar, corrigir ou excluir seus dados a qualquer momento.</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked === true)}
              />
              <Label htmlFor="consent" className="text-sm">
                Eu concordo com o tratamento dos meus dados conforme descrito acima e autorizo 
                o armazenamento seguro das informações do meu cartão na carteira digital.
              </Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowConsentModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setShowConsentModal(false);
                  setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                }}
                disabled={!consentGiven}
              >
                Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingMethod ? 'Editar' : 'Adicionar'} Cartão
          </DialogTitle>
          <DialogDescription>
            {editingMethod ? 'Atualize as informações do seu cartão' : 'Adicione um novo cartão à sua carteira digital'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Cartão</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cartão de Crédito</span>
                  </div>
                </SelectItem>
                <SelectItem value="debit_card">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cartão de Débito</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Bandeira</Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => setFormData({ ...formData, provider: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a bandeira" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="elo">Elo</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="hipercard">Hipercard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!editingMethod && (
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                value={formatCardNumber(formData.cardNumber || '')}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '') })}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Nome do Portador</Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              placeholder="Nome como aparece no cartão"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Mês</Label>
              <Select
                value={formData.expiryMonth?.toString()}
                onValueChange={(value) => setFormData({ ...formData, expiryMonth: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Ano</Label>
              <Select
                value={formData.expiryYear?.toString()}
                onValueChange={(value) => setFormData({ ...formData, expiryYear: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked === true })}
            />
            <Label htmlFor="isDefault">Definir como cartão padrão</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (editingMethod ? 'Atualizar' : 'Adicionar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
