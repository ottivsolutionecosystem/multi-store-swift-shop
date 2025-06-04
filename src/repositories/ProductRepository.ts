
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductInsert, ProductUpdate, ProductWithPromotion } from '@/types/product';
import { ProductQueryService } from '@/services/ProductQueryService';

export { ProductWithPromotion } from '@/types/product';

export class ProductRepository {
  private queryService: ProductQueryService;

  constructor(private storeId: string) {
    this.queryService = new ProductQueryService(storeId);
  }

  async findAll(): Promise<ProductWithPromotion[]> {
    return this.queryService.findAll();
  }

  async findByCategory(categoryId: string): Promise<ProductWithPromotion[]> {
    return this.queryService.findByCategory(categoryId);
  }

  async findByCategoryIncludingSubcategories(categoryId: string): Promise<ProductWithPromotion[]> {
    return this.queryService.findByCategoryIncludingSubcategories(categoryId);
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(product: Omit<ProductInsert, 'store_id'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, product: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('store_id', this.storeId);

    if (error) throw error;
  }
}
