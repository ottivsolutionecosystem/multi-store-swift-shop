
import { useQuery } from '@tanstack/react-query';
import { useServices } from '@/hooks/useServices';
import { OrderFilters, OrderSort } from '@/types/order-management';

export function useOrderData(filters: OrderFilters, sort: OrderSort) {
  const services = useServices();

  return useQuery({
    queryKey: ['orders', filters, sort],
    queryFn: async () => {
      if (!services?.orderService) {
        throw new Error('Order service not available');
      }
      return services.orderService.getOrdersWithFilters(filters);
    },
    enabled: !!services?.orderService,
  });
}
