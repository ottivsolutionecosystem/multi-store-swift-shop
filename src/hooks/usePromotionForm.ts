
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

  // Valores padrão sempre com arrays válidos
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

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!services) {
        console.log('📝 Services not available yet');
        return;
      }

      console.log('📝 Starting data load...');
      
      try {
        console.log('📝 Loading products and categories...');
        const [productsData, categoriesData] = await Promise.all([
          services.productService.getAllProducts(),
          services.categoryService.getAllCategories(),
        ]);

        console.log('📝 Raw products data:', productsData);
        console.log('📝 Raw categories data:', categoriesData);

        // Garantir que sempre tenhamos arrays válidos, mesmo se a API retornar algo inesperado
        const safeProducts = Array.isArray(productsData) ? productsData : [];
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];

        console.log('📝 Safe products:', safeProducts);
        console.log('📝 Safe categories:', safeCategories);

        setProducts(safeProducts);
        setCategories(safeCategories);

        if (promotionId) {
          console.log('📝 Loading promotion for edit:', promotionId);
          const promotion = await services.promotionService.getPromotionById(promotionId);
          if (promotion) {
            console.log('📝 Loaded promotion:', promotion);
            
            // Garantir arrays válidos para IDs
            let productIds: string[] = [];
            let categoryIds: string[] = [];

            // Verificar e converter product_ids
            if (Array.isArray(promotion.product_ids)) {
              productIds = promotion.product_ids as string[];
            } else if (promotion.product_id) {
              productIds = [promotion.product_id];
            }

            // Verificar e converter category_ids
            if (Array.isArray(promotion.category_ids)) {
              categoryIds = promotion.category_ids as string[];
            } else if (promotion.category_id) {
              categoryIds = [promotion.category_id];
            }

            console.log('📝 Product IDs:', productIds);
            console.log('📝 Category IDs:', categoryIds);

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

            console.log('📝 Form data to reset:', formData);
            form.reset(formData);
          }
        } else {
          console.log('📝 New promotion, using defaults');
          // Para nova promoção, garantir que os valores padrão sejam aplicados
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados necessários',
          variant: 'destructive',
        });
        // Em caso de erro, garantir arrays vazios
        setProducts([]);
        setCategories([]);
        // Reset para valores seguros
        form.reset(defaultValues);
      } finally {
        setIsDataLoading(false);
        console.log('📝 Data loading completed');
      }
    };

    loadData();
  }, [services, promotionId, form, toast]);

  const onSubmit = async (data: PromotionFormData) => {
    if (!services) return;

    console.log('📝 Form submission data:', data);
    
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

      // Garantir que os arrays sejam válidos e logs para debug
      const productIds = Array.isArray(data.product_ids) ? data.product_ids : [];
      const categoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];

      console.log('📝 Processed product IDs:', productIds);
      console.log('📝 Processed category IDs:', categoryIds);

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

      console.log('📝 Final promotion data:', promotionData);

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
      console.error('❌ Error saving promotion:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar promoção',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    products: Array.isArray(products) ? products : [],
    categories: Array.isArray(categories) ? categories : [],
    isLoading,
    isDataLoading,
    onSubmit,
  };
}
