
import { ProductRepository } from '@/repositories/ProductRepository';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }

  async getProductsByCategoryWithSubcategories(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategoryIncludingSubcategories(categoryId);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(product: Omit<ProductInsert, 'store_id'>): Promise<Product> {
    if (!product.name || product.name.trim() === '') {
      throw new Error('Product name is required');
    }
    
    if (product.price !== undefined && product.price < 0) {
      throw new Error('Product price cannot be negative');
    }

    return this.productRepository.create(product);
  }

  async updateProduct(id: string, product: ProductUpdate): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    return this.productRepository.update(id, product);
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    return this.productRepository.delete(id);
  }
}
