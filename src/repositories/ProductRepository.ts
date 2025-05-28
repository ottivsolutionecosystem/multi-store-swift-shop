
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductWithPromotion extends Product {
  promotion?: {
    id: string;
    name: string;
    discount_type: string;
    discount_value: number;
    promotional_price: number;
  } | null;
  category?: {
    id: string;
    name: string;
    parent_category?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export class ProductRepository {
  constructor(private storeId: string) {}

  async findAll(): Promise<ProductWithPromotion[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        promotions!left (
          id,
          name,
          discount_type,
          discount_value,
          start_date,
          end_date,
          is_active,
          priority
        ),
        categories!left (
          id,
          name,
          parent_category:categories!categories_parent_id_fkey (
            id,
            name
          )
        )
      `)
      .eq('store_id', this.storeId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return this.processProductsWithPromotions(data || []);
  }

  async findByCategory(categoryId: string): Promise<ProductWithPromotion[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        promotions!left (
          id,
          name,
          discount_type,
          discount_value,
          start_date,
          end_date,
          is_active,
          priority
        ),
        categories!left (
          id,
          name,
          parent_category:categories!categories_parent_id_fkey (
            id,
            name
          )
        )
      `)
      .eq('store_id', this.storeId)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return this.processProductsWithPromotions(data || []);
  }

  async findByCategoryIncludingSubcategories(categoryId: string): Promise<ProductWithPromotion[]> {
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
      .select(`
        *,
        promotions!left (
          id,
          name,
          discount_type,
          discount_value,
          start_date,
          end_date,
          is_active,
          priority
        ),
        categories!left (
          id,
          name,
          parent_category:categories!categories_parent_id_fkey (
            id,
            name
          )
        )
      `)
      .eq('store_id', this.storeId)
      .in('category_id', subcategoryIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subProdError) throw subProdError;

    const processedSubcategoryProducts = this.processProductsWithPromotions(subcategoryProducts || []);
    
    // Combinar produtos da categoria principal com produtos das subcategorias
    return [...mainCategoryProducts, ...processedSubcategoryProducts];
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

  private processProductsWithPromotions(products: any[]): ProductWithPromotion[] {
    return products.map(product => {
      const { promotions, categories, ...productData } = product;
      
      // Encontrar promoção ativa com maior prioridade
      const activePromotion = promotions?.find((promo: any) => {
        if (!promo.is_active) return false;
        const now = new Date();
        const startDate = new Date(promo.start_date);
        const endDate = new Date(promo.end_date);
        return now >= startDate && now <= endDate;
      });

      let promotion = null;
      if (activePromotion) {
        const promotionalPrice = this.calculatePromotionalPrice(
          productData.price,
          activePromotion.discount_type,
          activePromotion.discount_value
        );

        promotion = {
          id: activePromotion.id,
          name: activePromotion.name,
          discount_type: activePromotion.discount_type,
          discount_value: activePromotion.discount_value,
          promotional_price: promotionalPrice
        };
      }

      // Processar categoria
      let category = null;
      if (categories) {
        category = {
          id: categories.id,
          name: categories.name,
          parent_category: categories.parent_category || null
        };
      }

      return {
        ...productData,
        promotion,
        category
      };
    });
  }

  private calculatePromotionalPrice(originalPrice: number, discountType: string, discountValue: number): number {
    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else if (discountType === 'fixed_amount') {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  }
}
