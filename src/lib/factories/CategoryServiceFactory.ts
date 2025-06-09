
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { CategoryService } from '@/services/CategoryService';

export function createCategoryServices(storeId: string) {
  console.log('Creating category services for storeId:', storeId);

  // Repository
  const categoryRepository = new CategoryRepository(storeId);

  // Service
  const categoryService = new CategoryService(categoryRepository);

  return {
    categoryService,
  };
}
