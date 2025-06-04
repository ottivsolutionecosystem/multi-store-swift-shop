
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { promotionSchema, PromotionFormData } from '@/types/promotion';

interface UsePromotionFormProps {
  promotionId?: string;
  onSuccess: () => void;
}

export function usePromotionForm({ promotionId, onSuccess }: UsePromotionFormProps) {
  const services = useServices();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Valores padrão SEMPRE com arrays válidos e logs detalhados
  const defaultValues: PromotionFormData = {
    promotion_type: 'product',
    discount_type: 'percentage',
    priority: 0,
    status: 'draft',
    usage_limit_per_customer: 1,
    product_ids: [], // SEMPRE array vazio
    category_ids: [], // SEMPRE array vazio
    name: '',
    start_date: new Date(),
    end_date: new Date(),
    discount_value: 0,
  };

  console.log('🔧 usePromotionForm - Default values:', defaultValues);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!services) {
        console.log('🔧 usePromotionForm - Services not available yet');
        return;
      }

      console.log('🔧 usePromotionForm - Starting data load...');
      
      try {
        console.log('🔧 usePromotionForm - Loading products and categories...');
        const [productsData, categoriesData] = await Promise.all([
          services.productService.getAllProducts(),
          services.categoryService.getAllCategories(),
        ]);

        console.log('🔧 usePromotionForm - Raw data loaded:', {
          products: productsData?.length || 0,
          categories: categoriesData?.length || 0
        });

        // Garantir arrays seguros SEMPRE
        const safeProducts = Array.isArray(productsData) ? productsData : [];
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];

        console.log('🔧 usePromotionForm - Safe data set:', {
          safeProducts: safeProducts.length,
          safeCategories: safeCategories.length
        });

        setProducts(safeProducts);
        setCategories(safeCategories);

        if (promotionId) {
          console.log('🔧 usePromotionForm - Loading promotion for edit:', promotionId);
          const promotion = await services.promotionService.getPromotionById(promotionId);
          
          if (promotion) {
            console.log('🔧 usePromotionForm - Promotion loaded:', promotion);
            
            // Garantir arrays válidos para IDs com logs detalhados
            let productIds: string[] = [];
            let categoryIds: string[] = [];

            // Verificar product_ids
            if (Array.isArray(promotion.product_ids)) {
              productIds = promotion.product_ids as string[];
            } else if (promotion.product_id) {
              productIds = [promotion.product_id];
            }

            // Verificar category_ids
            if (Array.isArray(promotion.category_ids)) {
              categoryIds = promotion.category_ids as string[];
            } else if (promotion.category_id) {
              categoryIds = [promotion.category_id];
            }

            console.log('🔧 usePromotionForm - Processed IDs:', {
              productIds,
              categoryIds,
              productIdsLength: productIds.length,
              categoryIdsLength: categoryIds.length
            });

            const formData = {
              name: promotion.name || '',
              description: promotion.description || '',
              promotion_type: promotion.promotion_type as any || 'product',
              discount_type: promotion.discount_type || 'percentage',
              discount_value: Number(promotion.discount_value) || 0,
              start_date: new Date(promotion.start_date),
              end_date: new Date(promotion.end_date),
              product_ids: productIds, // SEMPRE array
              category_ids: categoryIds, // SEMPRE array
              minimum_purchase_amount: promotion.minimum_purchase_amount ? Number(promotion.minimum_purchase_amount) : undefined,
              usage_limit: promotion.usage_limit || undefined,
              usage_limit_per_customer: promotion.usage_limit_per_customer || 1,
              priority: promotion.priority || 0,
              status: promotion.status || 'draft',
            };

            console.log('🔧 usePromotionForm - Form data prepared for reset:', formData);
            
            // Reset com validação extra
            try {
              form.reset(formData);
              console.log('✅ usePromotionForm - Form reset successful');
            } catch (resetError) {
              console.error('❌ usePromotionForm - Form reset error:', resetError);
              // Fallback para valores padrão se houver erro
              form.reset(defaultValues);
            }
          }
        } else {
          console.log('🔧 usePromotionForm - New promotion, applying defaults');
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error('❌ usePromotionForm - Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados necessários',
          variant: 'destructive',
        });
        
        // Em caso de erro, garantir arrays vazios e reset seguro
        setProducts([]);
        setCategories([]);
        
        try {
          form.reset(defaultValues);
        } catch (resetError) {
          console.error('❌ usePromotionForm - Critical reset error:', resetError);
        }
      } finally {
        setIsDataLoading(false);
        console.log('🔧 usePromotionForm - Data loading completed');
      }
    };

    loadData();
  }, [services, promotionId, form, toast]);

  const onSubmit = async (data: PromotionFormData) => {
    if (!services) return;

    console.log('🔧 usePromotionForm - Form submission started:', data);
    
    setIsLoading(true);
    try {
      // Validações baseadas no status
      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (data.status === 'scheduled' && startDate <= now) {
        toast({
          title: 'Erro de Validação',
          description: 'Promoções agendadas devem ter data de início no futuro',
          variant: 'destructive',
        });
        return;
      }

      if (data.status === 'active' && (startDate > now || endDate < now)) {
        toast({
          title: 'Erro de Validação',
          description: 'Promoções ativas devem estar dentro do período de validade',
          variant: 'destructive',
        });
        return;
      }

      // Garantir arrays seguros para submissão com logs
      const productIds = Array.isArray(data.product_ids) ? data.product_ids : [];
      const categoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];

      console.log('🔧 usePromotionForm - Final submission data:', {
        productIds,
        categoryIds,
        promotionType: data.promotion_type
      });

      const promotionData = {
        name: data.name,
        description: data.description || null,
        promotion_type: data.promotion_type,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        product_ids: data.promotion_type === 'product' ? productIds : [],
        category_ids: data.promotion_type === 'category' ? categoryIds : [],
        minimum_purchase_amount: data.minimum_purchase_amount || 0,
        usage_limit: data.usage_limit || null,
        usage_limit_per_customer: data.usage_limit_per_customer || 1,
        priority: data.priority,
        status: data.status,
      };

      console.log('🔧 usePromotionForm - Sending to service:', promotionData);

      if (promotionId) {
        await services.promotionService.updatePromotion(promotionId, promotionData);
        toast({
          title: 'Sucesso',
          description: 'Promoção atualizada com sucesso!',
        });
      } else {
        await services.promotionService.createPromotion(promotionData);
        toast({
          title: 'Sucesso',
          description: 'Promoção criada com sucesso!',
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('❌ usePromotionForm - Submission error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar promoção',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Garantir retorno sempre consistente
  const returnData = {
    form,
    products: Array.isArray(products) ? products : [],
    categories: Array.isArray(categories) ? categories : [],
    isLoading,
    isDataLoading,
    onSubmit,
  };

  console.log('🔧 usePromotionForm - Return data:', {
    productsCount: returnData.products.length,
    categoriesCount: returnData.categories.length,
    isLoading: returnData.isLoading,
    isDataLoading: returnData.isDataLoading
  });

  return returnData;
}
