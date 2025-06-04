
import { supabase } from '@/integrations/supabase/client';
import { calculateBestPromotion } from '@/lib/promotionHierarchy';
import { ProductWithPromotion } from '@/types/product';

export class ProductPromotionService {
  constructor(private storeId: string) {}

  async processProductsWithPromotions(products: any[]): Promise<ProductWithPromotion[]> {
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
