
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(category: Omit<CategoryInsert, 'store_id'>): Promise<Category> {
    if (!category.name || category.name.trim() === '') {
      throw new Error('Category name is required');
    }

    return this.categoryRepository.create(category);
  }

  async updateCategory(id: string, category: CategoryUpdate): Promise<Category> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    return this.categoryRepository.update(id, category);
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    return this.categoryRepository.delete(id);
  }
}
