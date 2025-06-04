
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { calculateBestPromotion } from '@/lib/promotionHierarchy';

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
    promotion_type: 'global' | 'category' | 'product';
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
    
    return await this.processProductsWithPromotions(data || []);
  }

  async findByCategory(categoryId: string): Promise<ProductWithPromotion[]> {
    const { data, error } = await supabase
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
    
    return await this.processProductsWithPromotions(data || []);
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

    const processedSubcategoryProducts = await this.processProductsWithPromotions(subcategoryProducts || []);
    
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

  private async processProductsWithPromotions(products: any[]): Promise<ProductWithPromotion[]> {
    if (products.length === 0) return [];

    // Buscar todas as promoções ativas da loja
    const { data: allPromotions, error: promoError } = await supabase
      .from('promotions')
      .select('*')
      .eq('store_id', this.storeId)
      .eq('is_active', true);

    if (promoError) throw promoError;

    // Separar promoções por tipo
    const globalPromotions = allPromotions.filter(p => p.promotion_type === 'global');
    const categoryPromotions = allPromotions.filter(p => p.promotion_type === 'category');
    const productPromotions = allPromotions.filter(p => p.promotion_type === 'product');

    // Primeiro, coletar todos os parent_ids únicos das categorias
    const parentIds = [...new Set(
      products
        .map(p => p.categories?.parent_id)
        .filter(id => id != null)
    )];

    // Buscar todas as categorias pai em uma única consulta
    let parentCategories: any = {};
    if (parentIds.length > 0) {
      const { data: parents, error } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', parentIds);
      
      if (!error && parents) {
        parentCategories = parents.reduce((acc, parent) => {
          acc[parent.id] = parent;
          return acc;
        }, {});
      }
    }

    return products.map(product => {
      const { categories, ...productData } = product;
      
      // Buscar promoções específicas para este produto
      const specificProductPromotions = productPromotions.filter(p => p.product_id === productData.id);
      
      // Buscar promoções para a categoria do produto
      const specificCategoryPromotions = productData.category_id 
        ? categoryPromotions.filter(p => p.category_id === productData.category_id)
        : [];

      // Aplicar hierarquia de promoções
      const bestPromotion = calculateBestPromotion(
        productData.price,
        productData.compare_at_price,
        specificProductPromotions,
        specificCategoryPromotions,
        globalPromotions
      );

      // Processar categoria com parent
      let category = null;
      if (categories) {
        const parentCategory = categories.parent_id ? parentCategories[categories.parent_id] : null;
        
        category = {
          id: categories.id,
          name: categories.name,
          parent_category: parentCategory || null
        };
      }

      return {
        ...productData,
        promotion: bestPromotion,
        category
      };
    });
  }
}
