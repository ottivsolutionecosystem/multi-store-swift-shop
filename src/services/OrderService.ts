
import { OrderRepository } from '@/repositories/OrderRepository';
import { OrderFilters, OrderSort, OrderWithItems } from '@/types/order-management';

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async getOrdersWithFilters(filters: OrderFilters, sort: OrderSort): Promise<OrderWithItems[]> {
    console.log('OrderService - Getting orders with filters:', filters, 'sort:', sort);
    
    try {
      const orders = await this.orderRepository.findAllWithItems();
      
      // Apply filters
      let filteredOrders = orders;
      
      if (filters.status && filters.status.length > 0) {
        filteredOrders = filteredOrders.filter(order => 
          filters.status!.includes(order.status)
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.customer_name?.toLowerCase().includes(searchLower) ||
          order.customer_email?.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.minAmount !== undefined) {
        filteredOrders = filteredOrders.filter(order => 
          order.total_amount >= filters.minAmount!
        );
      }
      
      if (filters.maxAmount !== undefined) {
        filteredOrders = filteredOrders.filter(order => 
          order.total_amount <= filters.maxAmount!
        );
      }
      
      if (filters.dateRange?.from) {
        filteredOrders = filteredOrders.filter(order => 
          new Date(order.created_at) >= filters.dateRange!.from!
        );
      }
      
      if (filters.dateRange?.to) {
        filteredOrders = filteredOrders.filter(order => 
          new Date(order.created_at) <= filters.dateRange!.to!
        );
      }
      
      // Apply sorting
      filteredOrders.sort((a, b) => {
        let comparison = 0;
        
        switch (sort.field) {
          case 'created_at':
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
          case 'total_amount':
            comparison = a.total_amount - b.total_amount;
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'customer_name':
            const nameA = a.customer_name || '';
            const nameB = b.customer_name || '';
            comparison = nameA.localeCompare(nameB);
            break;
        }
        
        return sort.direction === 'desc' ? -comparison : comparison;
      });
      
      console.log('OrderService - Filtered and sorted orders:', filteredOrders.length);
      return filteredOrders;
      
    } catch (error) {
      console.error('OrderService - Error getting orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    console.log('OrderService - Updating order status:', orderId, status);
    
    try {
      await this.orderRepository.update(orderId, { status });
    } catch (error) {
      console.error('OrderService - Error updating order status:', error);
      throw error;
    }
  }

  async createOrder(orderData: any): Promise<any> {
    console.log('OrderService - Creating order:', orderData);
    
    try {
      return await this.orderRepository.create(orderData);
    } catch (error) {
      console.error('OrderService - Error creating order:', error);
      throw error;
    }
  }

  async addOrderItem(orderId: string, itemData: any): Promise<any> {
    console.log('OrderService - Adding order item:', orderId, itemData);
    
    try {
      // This would typically be handled by an OrderItemRepository
      // For now, we'll implement it directly in the OrderRepository
      return await this.orderRepository.addOrderItem(orderId, itemData);
    } catch (error) {
      console.error('OrderService - Error adding order item:', error);
      throw error;
    }
  }
}
