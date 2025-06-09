import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { ShippingMethod } from '@/types/shipping';
import { LogisticsHeader } from '@/components/admin/shipping/LogisticsHeader';
import { ShippingMethodsGrid } from '@/components/admin/shipping/ShippingMethodsGrid';
import { ShippingMethodsEmptyState } from '@/components/admin/shipping/ShippingMethodsEmptyState';
import { ShippingMethodFormDialog } from '@/components/admin/shipping/ShippingMethodFormDialog';

type ShippingMethodUpdate = Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>;

export default function LogisticsPage() {
  const navigate = useNavigate();
  const services = useServices();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);

  const { data: methods = [], isLoading } = useQuery({
    queryKey: ['shipping-methods'],
    queryFn: async () => {
      if (!services?.shippingService) {
        throw new Error('Shipping service not available');
      }
      return services.shippingService.getShippingMethods();
    },
    enabled: !!services?.shippingService,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => {
      if (!services?.shippingService) {
        throw new Error('Shipping service not available');
      }
      return services.shippingService.createShippingMethod(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      setIsDialogOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Método de frete criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar método de frete',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ShippingMethodUpdate }) => {
      if (!services?.shippingService) {
        throw new Error('Shipping service not available');
      }
      return services.shippingService.updateShippingMethod(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      setIsDialogOpen(false);
      setEditingMethod(null);
      toast({
        title: 'Sucesso',
        description: 'Método de frete atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar método de frete',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!services?.shippingService) {
        throw new Error('Shipping service not available');
      }
      return services.shippingService.deleteShippingMethod(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast({
        title: 'Sucesso',
        description: 'Método de frete excluído com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir método de frete',
        variant: 'destructive',
      });
    },
  });

  const handleCreateMethod = () => {
    setEditingMethod(null);
    setIsDialogOpen(true);
  };

  const handleEditMethod = (method: ShippingMethod) => {
    setEditingMethod(method);
    setIsDialogOpen(true);
  };

  const handleDeleteMethod = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este método de frete?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmitMethod = async (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => {
    if (editingMethod) {
      updateMutation.mutate({ id: editingMethod.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (!services) {
    return <div>Carregando serviços...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LogisticsHeader onCreateMethod={handleCreateMethod} />

        {isLoading ? (
          <div className="text-center py-8">Carregando métodos de frete...</div>
        ) : methods.length === 0 ? (
          <ShippingMethodsEmptyState onCreateMethod={handleCreateMethod} />
        ) : (
          <ShippingMethodsGrid
            methods={methods}
            onEdit={handleEditMethod}
            onDelete={handleDeleteMethod}
          />
        )}

        <ShippingMethodFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingMethod={editingMethod}
          onSubmit={handleSubmitMethod}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
}
