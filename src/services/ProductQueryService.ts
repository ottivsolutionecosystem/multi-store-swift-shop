
import { createSupabaseClient } from '@/lib/supabaseClient';
import { ProductWithPromotion } from '@/types/product';
import { ProductPromotionService } from './ProductPromotionService';

export class ProductQueryService {
  private supabase = createSupabaseClient();
  private promotionService: ProductPromotionService;

  constructor(private storeId: string) {
    this.promotionService = new ProductPromotionService(storeId);
  }

  async findAll(): Promise<ProductWithPromotion[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        categories!left (
          id,
          name,
          parent_id
        )
      `)
      .eq('store_id', this.storeId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return await this.promotionService.processProductsWithPromotions(data || []);
  }

  async findByCategory(categoryId: string): Promise<ProductWithPromotion[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        categories!left (
          id,
          name,
          parent_id
        )
      `)
      .eq('store_id', this.storeId)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return await this.promotionService.processProductsWithPromotions(data || []);
  }

  async findByCategoryIncludingSubcategories(categoryId: string): Promise<ProductWithPromotion[]> {
    // Primeiro, buscar produtos da categoria principal
    const mainCategoryProducts = await this.findByCategory(categoryId);
    
    // Depois, buscar subcategorias e seus produtos
    const { data: subcategories, error: subcatError } = await this.supabase
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
    const { data: subcategoryProducts, error: subProdError } = await this.supabase
      .from('products')
      .select(`
        *,
        categories!left (
          id,
          name,
          parent_id
        )
      `)
      .eq('store_id', this.storeId)
      .in('category_id', subcategoryIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subProdError) throw subProdError;

    const processedSubcategoryProducts = await this.promotionService.processProductsWithPromotions(subcategoryProducts || []);
    
    // Combinar produtos da categoria principal com produtos das subcategorias
    return [...mainCategoryProducts, ...processedSubcategoryProducts];
  }
}
