
import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { PromotionFormData } from '@/types/promotion';

interface UsePromotionFormDataProps {
  promotionId?: string;
  form: any;
}

export function usePromotionFormData({ promotionId, form }: UsePromotionFormDataProps) {
  const services = useServices();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const defaultValues: PromotionFormData = {
    promotion_type: 'product',
    discount_type: 'percentage',
    priority: 0,
    status: 'draft',
    usage_limit_per_customer: 1,
    product_ids: [],
    category_ids: [],
    name: '',
    start_date: new Date(),
    end_date: new Date(),
    discount_value: 0,
  };

  useEffect(() => {
    const loadData = async () => {
      if (!services) {
        console.log('🔧 usePromotionFormData - Services not available yet');
        return;
      }

      console.log('🔧 usePromotionFormData - Starting data load...');
      
      try {
        console.log('🔧 usePromotionFormData - Loading products and categories...');
        const [productsData, categoriesData] = await Promise.all([
          services.productService.getAllProducts(),
          services.categoryService.getAllCategories(),
        ]);

        console.log('🔧 usePromotionFormData - Raw data loaded:', {
          products: productsData?.length || 0,
          categories: categoriesData?.length || 0
        });

        const safeProducts = Array.isArray(productsData) ? productsData : [];
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];

        console.log('🔧 usePromotionFormData - Safe data set:', {
          safeProducts: safeProducts.length,
          safeCategories: safeCategories.length
        });

        setProducts(safeProducts);
        setCategories(safeCategories);

        if (promotionId) {
          console.log('🔧 usePromotionFormData - Loading promotion for edit:', promotionId);
          const promotion = await services.promotionService.getPromotionById(promotionId);
          
          if (promotion) {
            console.log('🔧 usePromotionFormData - Promotion loaded:', promotion);
            
            let productIds: string[] = [];
            let categoryIds: string[] = [];

            if (Array.isArray(promotion.product_ids)) {
              productIds = promotion.product_ids as string[];
            } else if (promotion.product_id) {
              productIds = [promotion.product_id];
            }

            if (Array.isArray(promotion.category_ids)) {
              categoryIds = promotion.category_ids as string[];
            } else if (promotion.category_id) {
              categoryIds = [promotion.category_id];
            }

            console.log('🔧 usePromotionFormData - Processed IDs:', {
              productIds,
              categoryIds
            });

            const formData = {
              name: promotion.name || '',
              description: promotion.description || '',
              promotion_type: promotion.promotion_type as any || 'product',
              discount_type: promotion.discount_type || 'percentage',
              discount_value: Number(promotion.discount_value) || 0,
              start_date: new Date(promotion.start_date),
              end_date: new Date(promotion.end_date),
              product_ids: productIds,
              category_ids: categoryIds,
              minimum_purchase_amount: promotion.minimum_purchase_amount ? Number(promotion.minimum_purchase_amount) : undefined,
              usage_limit: promotion.usage_limit || undefined,
              usage_limit_per_customer: promotion.usage_limit_per_customer || 1,
              priority: promotion.priority || 0,
              status: promotion.status || 'draft',
            };

            console.log('🔧 usePromotionFormData - Form data prepared for reset:', formData);
            
            try {
              form.reset(formData);
              console.log('✅ usePromotionFormData - Form reset successful');
            } catch (resetError) {
              console.error('❌ usePromotionFormData - Form reset error:', resetError);
              form.reset(defaultValues);
            }
          }
        } else {
          console.log('🔧 usePromotionFormData - New promotion, applying defaults');
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error('❌ usePromotionFormData - Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados necessários',
          variant: 'destructive',
        });
        
        setProducts([]);
        setCategories([]);
        
        try {
          form.reset(defaultValues);
        } catch (resetError) {
          console.error('❌ usePromotionFormData - Critical reset error:', resetError);
        }
      } finally {
        setIsDataLoading(false);
        console.log('🔧 usePromotionFormData - Data loading completed');
      }
    };

    loadData();
  }, [services, promotionId, form, toast]);

  const returnData = {
    products: Array.isArray(products) ? products : [],
    categories: Array.isArray(categories) ? categories : [],
    isDataLoading,
  };

  console.log('🔧 usePromotionFormData - Return data:', {
    productsCount: returnData.products.length,
    categoriesCount: returnData.categories.length,
    isDataLoading: returnData.isDataLoading
  });

  return returnData;
}
