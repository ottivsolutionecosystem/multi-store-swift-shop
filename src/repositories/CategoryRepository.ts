
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
