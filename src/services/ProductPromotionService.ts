
import { createSupabaseClient } from '@/lib/supabaseClient';
import { calculateBestPromotion } from '@/lib/promotionHierarchy';
import { ProductWithPromotion } from '@/types/product';

export class ProductPromotionService {
  private supabase = createSupabaseClient();

  constructor(private storeId: string) {}

  async processProductsWithPromotions(products: any[]): Promise<ProductWithPromotion[]> {
    if (!Array.isArray(products) || products.length === 0) {
      console.log('🎯 ProductPromotionService - No products to process');
      return [];
    }

    console.log('🎯 ProductPromotionService - Processing', products.length, 'products');

    try {
      // Buscar todas as promoções ativas da loja
      const { data: allPromotions, error: promoError } = await this.supabase
        .from('promotions')
        .select('*')
        .eq('store_id', this.storeId)
        .eq('status', 'active');

      if (promoError) {
        console.error('🎯 ProductPromotionService - Error fetching promotions:', promoError);
        throw promoError;
      }

      const promotions = allPromotions || [];
      console.log('🎯 ProductPromotionService - Found', promotions.length, 'active promotions');

      // Separar promoções por tipo
      const globalPromotions = promotions.filter(p => p.promotion_type === 'global');
      const categoryPromotions = promotions.filter(p => p.promotion_type === 'category');
      const productPromotions = promotions.filter(p => p.promotion_type === 'product');

      // Primeiro, coletar todos os parent_ids únicos das categorias
      const parentIds = [...new Set(
        products
          .map(p => p.categories?.parent_id)
          .filter(id => id != null)
      )];

      // Buscar todas as categorias pai em uma única consulta
      let parentCategories: any = {};
      if (parentIds.length > 0) {
        const { data: parents, error } = await this.supabase
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
        try {
          const { categories, ...productData } = product;
          
          // Validar dados do produto
          if (!productData || typeof productData.price !== 'number') {
            console.warn('🎯 ProductPromotionService - Invalid product data:', productData?.id);
            return {
              ...productData,
              promotion: null,
              category: null
            };
          }
          
          // Buscar promoções específicas para este produto usando JSONB arrays
          const specificProductPromotions = productPromotions.filter(p => {
            const productIds = p.product_ids as string[] || [];
            return productIds.includes(productData.id);
          });
          
          // Buscar promoções para a categoria do produto usando JSONB arrays
          const specificCategoryPromotions = productData.category_id 
            ? categoryPromotions.filter(p => {
                const categoryIds = p.category_ids as string[] || [];
                return categoryIds.includes(productData.category_id);
              })
            : [];

          // Aplicar hierarquia de promoções - garantir que sempre retorna null ou objeto válido
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

          const result = {
            ...productData,
            promotion: bestPromotion, // Garantido que é null ou objeto válido
            category
          };

          console.log('🎯 ProductPromotionService - Processed product:', productData.id, 'promotion:', bestPromotion?.id || 'none');
          return result;
        } catch (error) {
          console.error('🎯 ProductPromotionService - Error processing product:', product?.id, error);
          // Retorna produto com promotion null em caso de erro
          return {
            ...product,
            promotion: null,
            category: null
          };
        }
      });
    } catch (error) {
      console.error('🎯 ProductPromotionService - Fatal error:', error);
      // Em caso de erro fatal, retorna produtos sem promoções
      return products.map(product => ({
        ...product,
        promotion: null,
        category: null
      }));
    }
  }
}
