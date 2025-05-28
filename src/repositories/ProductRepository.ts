
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export class ProductRepository {
  constructor(private storeId: string) {}

  async findAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCategoryIncludingSubcategories(categoryId: string): Promise<Product[]> {
    // Primeiro, buscar produtos da categoria principal
    const mainCategoryProducts = await this.findByCategory(categoryId);
    
    // Depois, buscar subcategorias e seus produtos
    const { data: subcategories, error: subcatError } = await supabase
      .from('categories')
      .select('id')
      .eq('store_id', this.storeId)
      .eq('parent_id', categoryId);

    if (subcatError) throw subcatError;

    if (!subcategories || subcategories.length === 0) {
      return mainCategoryProducts;
    }

    // Buscar produtos de todas as subcategorias
    const subcategoryIds = subcategories.map(sub => sub.id);
    const { data: subcategoryProducts, error: subProdError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', this.storeId)
      .in('category_id', subcategoryIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subProdError) throw subProdError;

    // Combinar produtos da categoria principal com produtos das subcategorias
    return [...mainCategoryProducts, ...(subcategoryProducts || [])];
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
