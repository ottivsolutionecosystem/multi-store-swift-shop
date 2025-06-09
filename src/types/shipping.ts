
export type ShippingMethodType = 'express' | 'api';
export type DeliveryLabelType = 'days' | 'guaranteed';

export interface ShippingMethod {
  id: string;
  store_id: string;
  name: string;
  type: ShippingMethodType;
  is_active: boolean;
  
  // Campos para Frete Expresso
  price?: number;
  delivery_days?: number;
  delivery_label_type?: DeliveryLabelType;
  
  // Campos para Frete API
  api_url?: string;
  api_headers?: Record<string, string>;
  
  created_at: string;
  updated_at: string;
}

export interface ShippingCalculation {
  method_id: string;
  method_name: string;
  price: number;
  delivery_days?: number;
  delivery_label?: string;
  error?: string;
}

export interface ProductDimensions {
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}
