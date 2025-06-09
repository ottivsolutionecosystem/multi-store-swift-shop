
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
      
      // Convert filters to match service expectations
      const serviceFilters = {
        status: filters.status?.[0], // Take first status if array
        startDate: filters.dateRange?.from?.toISOString(),
        endDate: filters.dateRange?.to?.toISOString(),
        search: filters.search,
      };
      
      return services.orderService.getOrdersWithFilters(serviceFilters);
    },
    enabled: !!services?.orderService,
  });
}
