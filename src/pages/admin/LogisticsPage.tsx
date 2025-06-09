
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ShippingMethodCard } from '@/components/admin/shipping/ShippingMethodCard';
import { ShippingMethodForm } from '@/components/admin/shipping/ShippingMethodForm';
import { ShippingMethod } from '@/types/shipping';
import { ArrowLeft, Plus, Truck } from 'lucide-react';

export default function LogisticsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const services = useServices();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    const loadShippingMethods = async () => {
      if (!services) return;

      try {
        setLoading(true);
        const methods = await services.shippingService.getAllShippingMethods();
        setShippingMethods(methods);
      } catch (error) {
        console.error('Error loading shipping methods:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar métodos de frete',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadShippingMethods();
  }, [services, toast]);

  const handleCreateMethod = () => {
    setEditingMethod(null);
    setShowForm(true);
  };

  const handleEditMethod = (method: ShippingMethod) => {
    setEditingMethod(method);
    setShowForm(true);
  };

  const handleDeleteMethod = async (id: string) => {
    if (!services) return;

    try {
      setSubmitting(true);
      await services.shippingService.deleteShippingMethod(id);
      setShippingMethods(prev => prev.filter(m => m.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Método de frete excluído com sucesso',
      });
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir método de frete',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setDeletingMethodId(null);
    }
  };

  const handleSubmitMethod = async (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => {
    if (!services) return;

    try {
      setSubmitting(true);
      
      if (editingMethod) {
        const updated = await services.shippingService.updateShippingMethod(editingMethod.id, data);
        setShippingMethods(prev => prev.map(m => m.id === editingMethod.id ? updated : m));
        toast({
          title: 'Sucesso',
          description: 'Método de frete atualizado com sucesso',
        });
      } else {
        const created = await services.shippingService.createShippingMethod(data);
        setShippingMethods(prev => [created, ...prev]);
        toast({
          title: 'Sucesso',
          description: 'Método de frete criado com sucesso',
        });
      }
      
      setShowForm(false);
      setEditingMethod(null);
    } catch (error) {
      console.error('Error saving shipping method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar método de frete',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Admin
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Truck className="h-8 w-8 text-blue-600" />
                Logística
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie os métodos de frete da sua loja
              </p>
            </div>
            
            <Button onClick={handleCreateMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Método de Frete
            </Button>
          </div>
        </div>

        {shippingMethods.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum método de frete configurado
            </h2>
            <p className="text-gray-600 mb-6">
              Configure métodos de frete para oferecer opções de entrega aos seus clientes
            </p>
            <Button onClick={handleCreateMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Método
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingMethods.map((method) => (
              <ShippingMethodCard
                key={method.id}
                shippingMethod={method}
                onEdit={handleEditMethod}
                onDelete={(id) => setDeletingMethodId(id)}
              />
            ))}
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'Editar Método de Frete' : 'Novo Método de Frete'}
              </DialogTitle>
            </DialogHeader>
            <ShippingMethodForm
              shippingMethod={editingMethod}
              onSubmit={handleSubmitMethod}
              onCancel={() => setShowForm(false)}
              loading={submitting}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingMethodId} onOpenChange={() => setDeletingMethodId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir este método de frete? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingMethodId && handleDeleteMethod(deletingMethodId)}
                disabled={submitting}
              >
                {submitting ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
