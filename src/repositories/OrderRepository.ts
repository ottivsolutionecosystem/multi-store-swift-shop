
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { OrderWithItems, OrderItemWithDetails, OrderStatus } from '@/types/order-management';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export class OrderRepository {
  constructor(private storeId: string) {}

  async findAllByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', this.storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findAllWithItems(): Promise<OrderWithItems[]> {
    console.log('OrderRepository - Finding all orders with items for store:', this.storeId);
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_url
          ),
          promotions (
            id,
            name,
            discount_type,
            discount_value
          )
        )
      `)
      .eq('store_id', this.storeId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('OrderRepository - Error fetching orders:', ordersError);
      throw ordersError;
    }

    console.log('OrderRepository - Found orders:', orders?.length || 0);
    
    const ordersWithItems: OrderWithItems[] = (orders || []).map(order => ({
      ...order,
      status: order.status as OrderStatus, // Type assertion to fix the status type
      items: (order.order_items || []).map(item => ({
        ...item,
        product: item.products || { id: '', name: 'Produto não encontrado', image_url: null },
        promotion: item.promotions || null,
      } as OrderItemWithDetails)),
    }));

    return ordersWithItems;
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(order: Omit<OrderInsert, 'store_id'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...order, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, order: OrderUpdate): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
