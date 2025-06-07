
import { z } from 'zod';

export type OrderViewMode = 'table' | 'list';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderSortField = 'created_at' | 'total_amount' | 'status' | 'customer_name';
export type OrderSortDirection = 'asc' | 'desc';

export const orderFilterSchema = z.object({
  status: z.array(z.string()).optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().optional(),
});

export type OrderFilters = z.infer<typeof orderFilterSchema>;

export interface OrderSort {
  field: OrderSortField;
  direction: OrderSortDirection;
}

export interface OrderManagementState {
  viewMode: OrderViewMode;
  filters: OrderFilters;
  sort: OrderSort;
}

export interface OrderWithItems {
  id: string;
  store_id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  shipping_cost: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: any;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItemWithDetails[];
}

export interface OrderItemWithDetails {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  promotion_id: string | null;
  created_at: string;
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
  promotion: {
    id: string;
    name: string;
    discount_type: string;
    discount_value: number;
  } | null;
}
