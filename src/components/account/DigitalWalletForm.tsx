
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard } from 'lucide-react';
import { DigitalWalletCardFormData } from '@/types/digital-wallet';

interface DigitalWalletFormProps {
  formData: DigitalWalletCardFormData;
  setFormData: (data: DigitalWalletCardFormData) => void;
  loading: boolean;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function DigitalWalletForm({
  formData,
  setFormData,
  loading,
  isEditing,
  onSubmit,
  onCancel
}: DigitalWalletFormProps) {
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      {!isEditing && (
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Adicionar')}
        </Button>
      </div>
    </form>
  );
}
