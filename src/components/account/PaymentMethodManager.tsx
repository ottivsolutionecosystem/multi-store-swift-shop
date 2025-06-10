
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { PaymentMethodFormDialog } from './PaymentMethodFormDialog';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentMethodEmptyState } from './PaymentMethodEmptyState';
import { PaymentMethodSecurityInfo } from './PaymentMethodSecurityInfo';
import { PaymentMethod } from '@/types/payment-method';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';

export function PaymentMethodManager() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const services = useServices();
  const { toast } = useToast();

  const loadPaymentMethods = async () => {
    if (!services) return;
    
    try {
      setLoading(true);
      const methods = await services.paymentMethodService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
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
    loadPaymentMethods();
  }, [services]);

  const handleSetDefault = async (methodId: string) => {
    if (!services) return;
    
    try {
      await services.paymentMethodService.setDefaultPaymentMethod(methodId);
      await loadPaymentMethods();
      toast({
        title: 'Sucesso',
        description: 'Cartão padrão atualizado',
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir cartão padrão',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (methodId: string) => {
    if (!services) return;
    
    try {
      await services.paymentMethodService.removePaymentMethod(methodId);
      await loadPaymentMethods();
      toast({
        title: 'Sucesso',
        description: 'Cartão removido da carteira',
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover cartão',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setDialogOpen(true);
  };

  const handleAddCard = () => {
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    loadPaymentMethods();
    setDialogOpen(false);
    setEditingMethod(null);
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
          {paymentMethods.length === 0 ? (
            <PaymentMethodEmptyState onAddCard={handleAddCard} />
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onSetDefault={handleSetDefault}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
          
          <PaymentMethodSecurityInfo />
        </CardContent>
      </Card>

      <PaymentMethodFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingMethod={editingMethod}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
}
