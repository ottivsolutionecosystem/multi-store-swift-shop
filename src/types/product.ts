
import { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductWithPromotion extends Product {
  promotion?: {
    id: string;
    name: string;
    discount_type: string;
    discount_value: number;
    promotional_price: number;
    promotion_type: 'global' | 'category' | 'product';
    compare_at_price?: number | null;
  } | null;
  category?: {
    id: string;
    name: string;
    parent_category?: {
      id: string;
      name: string;
    } | null;
  } | null;
}
