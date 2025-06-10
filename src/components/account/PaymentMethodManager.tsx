
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Star, Trash2, Edit, Wallet } from 'lucide-react';
import { PaymentMethodFormDialog } from './PaymentMethodFormDialog';
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

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    return {
      title: `${method.provider?.toUpperCase() || 'Cartão'} •••• ${method.lastFourDigits}`,
      subtitle: method.cardholderName || 'Nome não informado'
    };
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
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Nenhum cartão salvo na sua carteira</p>
              <p className="text-sm text-gray-400 mb-4">
                Salve seus cartões para fazer compras mais rapidamente
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                Adicionar primeiro cartão
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const display = getPaymentMethodDisplay(method);
                return (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
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
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Definir como padrão
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMethod(method);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Segurança e Privacidade</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Armazenamos apenas os últimos 4 dígitos para sua segurança</li>
              <li>• Seus dados são criptografados e protegidos</li>
              <li>• Use sua carteira para checkout mais rápido</li>
              <li>• Conforme a Lei Geral de Proteção de Dados (LGPD)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <PaymentMethodFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingMethod={editingMethod}
        onSuccess={() => {
          loadPaymentMethods();
          setDialogOpen(false);
          setEditingMethod(null);
        }}
      />
    </>
  );
}
