
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export class CategoryRepository {
  constructor(private storeId: string) {}

  async findAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', this.storeId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async findMainCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', this.storeId)
      .is('parent_id', null)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async findSubcategories(parentId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('parent_id', parentId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async findCategoryWithSubcategories(): Promise<(Category & { subcategories?: Category[] })[]> {
    // Buscar categorias principais
    const mainCategories = await this.findMainCategories();
    
    // Para cada categoria principal, buscar suas subcategorias
    const categoriesWithSubs = await Promise.all(
      mainCategories.map(async (category) => {
        const subcategories = await this.findSubcategories(category.id);
        return { ...category, subcategories };
      })
    );

    return categoriesWithSubs;
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('store_id', this.storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(category: Omit<CategoryInsert, 'store_id'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, store_id: this.storeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, category: CategoryUpdate): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .eq('store_id', this.storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('store_id', this.storeId);

    if (error) throw error;
  }
}
