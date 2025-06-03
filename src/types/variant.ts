
export interface VariantData {
  name: string;
  values: string[];
}

export interface CombinationData {
  variantValueIds: string[];
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  costPerItem?: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface CombinationUpdateData {
  sku?: string;
  price?: number;
  compare_at_price?: number;
  cost_per_item?: number;
  stock_quantity?: number;
  is_active?: boolean;
  compareAtPrice?: number;
  costPerItem?: number;
  stockQuantity?: number;
  isActive?: boolean;
}
