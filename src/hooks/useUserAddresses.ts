
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { UserAddressFormData } from '@/types/user-address';
import { useToast } from '@/hooks/use-toast';

export function useUserAddresses() {
  const { user } = useAuth();
  const services = useServices();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: addresses = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      if (!services?.userAddressService || !user?.id) {
        throw new Error('Service not available or user not authenticated');
      }
      return services.userAddressService.getUserAddresses(user.id);
    },
    enabled: !!services?.userAddressService && !!user?.id,
  });

  const createAddressMutation = useMutation({
    mutationFn: async (addressData: UserAddressFormData) => {
      if (!services?.userAddressService || !user?.id) {
        throw new Error('Service not available or user not authenticated');
      }
      return services.userAddressService.createAddress(addressData, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses', user?.id] });
      toast({
        title: 'Endereço criado',
        description: 'O endereço foi criado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar endereço',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserAddressFormData> }) => {
      if (!services?.userAddressService || !user?.id) {
        throw new Error('Service not available or user not authenticated');
      }
      return services.userAddressService.updateAddress(id, data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses', user?.id] });
      toast({
        title: 'Endereço atualizado',
        description: 'O endereço foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar endereço',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!services?.userAddressService || !user?.id) {
        throw new Error('Service not available or user not authenticated');
      }
      return services.userAddressService.deleteAddress(id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses', user?.id] });
      toast({
        title: 'Endereço excluído',
        description: 'O endereço foi excluído com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir endereço',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!services?.userAddressService || !user?.id) {
        throw new Error('Service not available or user not authenticated');
      }
      return services.userAddressService.setDefaultAddress(id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses', user?.id] });
      toast({
        title: 'Endereço padrão definido',
        description: 'O endereço padrão foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao definir endereço padrão',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    addresses,
    isLoading,
    error,
    createAddress: createAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    setDefaultAddress: setDefaultMutation.mutate,
    isCreating: createAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
    isSettingDefault: setDefaultMutation.isPending,
  };
}
