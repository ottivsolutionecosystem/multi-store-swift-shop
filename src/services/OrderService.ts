
import { OrderRepository } from '@/repositories/OrderRepository';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

interface CreateOrderData {
  user_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  shipping_cost?: number;
  discount_amount?: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: any;
  notes?: string;
  payment_method?: string;
}

interface CreateOrderItemData {
  product_id: string;
  quantity: number;
  price: number;
  promotion_id?: string;
}

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private storeId: string
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const orderInsert: Omit<OrderInsert, 'store_id'> = {
      user_id: orderData.user_id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      total_amount: orderData.total_amount,
      shipping_cost: orderData.shipping_cost || 0,
      discount_amount: orderData.discount_amount || 0,
      status: orderData.status,
      shipping_address: orderData.shipping_address,
      notes: orderData.notes,
      payment_method: orderData.payment_method,
    };

    return this.orderRepository.create(orderInsert);
  }

  async updateOrder(id: string, orderData: Partial<OrderUpdate>): Promise<Order> {
    return this.orderRepository.update(id, orderData);
  }

  async deleteOrder(id: string): Promise<void> {
    return this.orderRepository.delete(id);
  }

  async addOrderItem(orderId: string, itemData: CreateOrderItemData): Promise<OrderItem> {
    const orderItemInsert: Omit<OrderItemInsert, 'order_id'> = {
      product_id: itemData.product_id,
      quantity: itemData.quantity,
      price: itemData.price,
      promotion_id: itemData.promotion_id,
    };

    return this.orderRepository.addOrderItem(orderId, orderItemInsert);
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.orderRepository.getOrderItems(orderId);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return this.updateOrder(id, { status });
  }

  async getOrdersWithFilters(filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<Order[]> {
    // Implementar filtros conforme necessário
    return this.orderRepository.findAll();
  }
}
