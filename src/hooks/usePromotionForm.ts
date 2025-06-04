
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

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      promotion_type: 'product',
      discount_type: 'percentage',
      priority: 0,
      status: 'draft',
      usage_limit_per_customer: 1,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!services) return;

      try {
        const [productsData, categoriesData] = await Promise.all([
          services.productService.getAllProducts(),
          services.categoryService.getAllCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);

        if (promotionId) {
          const promotion = await services.promotionService.getPromotionById(promotionId);
          if (promotion) {
            form.reset({
              name: promotion.name,
              description: promotion.description || '',
              promotion_type: promotion.promotion_type as any,
              discount_type: promotion.discount_type,
              discount_value: Number(promotion.discount_value),
              start_date: new Date(promotion.start_date),
              end_date: new Date(promotion.end_date),
              product_id: promotion.product_id || undefined,
              category_id: promotion.category_id || undefined,
              minimum_purchase_amount: promotion.minimum_purchase_amount ? Number(promotion.minimum_purchase_amount) : undefined,
              usage_limit: promotion.usage_limit || undefined,
              usage_limit_per_customer: promotion.usage_limit_per_customer || 1,
              priority: promotion.priority,
              status: promotion.status,
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados necessários',
          variant: 'destructive',
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [services, promotionId, form.reset, toast]);

  const onSubmit = async (data: PromotionFormData) => {
    if (!services) return;

    setIsLoading(true);
    try {
      const promotionData = {
        name: data.name,
        description: data.description || null,
        promotion_type: data.promotion_type,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        product_id: data.promotion_type === 'product' ? data.product_id || null : null,
        category_id: data.promotion_type === 'category' ? data.category_id || null : null,
        minimum_purchase_amount: data.minimum_purchase_amount || 0,
        usage_limit: data.usage_limit || null,
        usage_limit_per_customer: data.usage_limit_per_customer || 1,
        priority: data.priority,
        status: data.status,
      };

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
      console.error('Erro ao salvar promoção:', error);
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
    products,
    categories,
    isLoading,
    isDataLoading,
    onSubmit,
  };
}
