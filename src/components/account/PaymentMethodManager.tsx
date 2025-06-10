
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Smartphone, Star, Trash2, Edit } from 'lucide-react';
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
        description: 'Erro ao carregar métodos de pagamento',
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
        description: 'Método de pagamento padrão atualizado',
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir método padrão',
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
        description: 'Método de pagamento removido',
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover método de pagamento',
        variant: 'destructive',
      });
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'pix':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    if (method.type === 'pix') {
      return {
        title: 'PIX',
        subtitle: `${method.pixKeyType?.toUpperCase()}: ${method.pixKey?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.**$4') || '***'}`
      };
    }
    
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
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Gerencie seus cartões e métodos de pagamento salvos
              </CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Nenhum método de pagamento cadastrado</p>
              <Button onClick={() => setDialogOpen(true)}>
                Adicionar primeiro método
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
                      {getPaymentMethodIcon(method.type)}
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
              <li>• Seus dados de pagamento são criptografados e protegidos</li>
              <li>• Armazenamos apenas os últimos 4 dígitos do cartão</li>
              <li>• Você pode remover seus dados a qualquer momento</li>
              <li>• Conformidade com a Lei Geral de Proteção de Dados (LGPD)</li>
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
