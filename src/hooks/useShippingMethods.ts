
import { useState, useEffect } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingMethod } from '@/types/shipping';

export function useShippingMethods() {
  const services = useServices();
  const { toast } = useToast();
  
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const createMethod = async (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => {
    if (!services) return;

    try {
      setSubmitting(true);
      const created = await services.shippingService.createShippingMethod(data);
      setShippingMethods(prev => [created, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Método de frete criado com sucesso',
      });
      return created;
    } catch (error) {
      console.error('Error creating shipping method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar método de frete',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateMethod = async (id: string, data: Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>) => {
    if (!services) return;

    try {
      setSubmitting(true);
      const updated = await services.shippingService.updateShippingMethod(id, data);
      setShippingMethods(prev => prev.map(m => m.id === id ? updated : m));
      toast({
        title: 'Sucesso',
        description: 'Método de frete atualizado com sucesso',
      });
      return updated;
    } catch (error) {
      console.error('Error updating shipping method:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar método de frete',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMethod = async (id: string) => {
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
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    shippingMethods,
    loading,
    submitting,
    createMethod,
    updateMethod,
    deleteMethod,
  };
}
