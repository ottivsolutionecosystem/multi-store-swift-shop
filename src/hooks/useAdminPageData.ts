
import { useQueries } from '@tanstack/react-query';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';

interface UseAdminPageDataOptions {
  loadProducts?: boolean;
  loadCategories?: boolean;
  loadPromotions?: boolean;
  loadShipping?: boolean;
}

export function useAdminPageData(options: UseAdminPageDataOptions = {}) {
  const services = useServices();
  const { toast } = useToast();

  const {
    loadProducts = false,
    loadCategories = false,
    loadPromotions = false,
    loadShipping = false,
  } = options;

  const queries = useQueries({
    queries: [
      {
        queryKey: ['products'],
        queryFn: async () => {
          if (!services?.productService) {
            throw new Error('Product service not available');
          }
          return services.productService.getAllProducts();
        },
        enabled: loadProducts && !!services?.productService,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 2,
        onError: (error: any) => {
          console.error('Erro ao carregar produtos:', error);
          toast({
            title: 'Erro',
            description: 'Erro ao carregar produtos',
            variant: 'destructive',
          });
        }
      },
      {
        queryKey: ['categories'],
        queryFn: async () => {
          if (!services?.categoryService) {
            throw new Error('Category service not available');
          }
          return services.categoryService.getAllCategories();
        },
        enabled: loadCategories && !!services?.categoryService,
        staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
        gcTime: 20 * 60 * 1000, // 20 minutes
        retry: 2,
        onError: (error: any) => {
          console.error('Erro ao carregar categorias:', error);
          toast({
            title: 'Erro',
            description: 'Erro ao carregar categorias',
            variant: 'destructive',
          });
        }
      },
      {
        queryKey: ['promotions'],
        queryFn: async () => {
          if (!services?.promotionService) {
            throw new Error('Promotion service not available');
          }
          return services.promotionService.getAllPromotions();
        },
        enabled: loadPromotions && !!services?.promotionService,
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        onError: (error: any) => {
          console.error('Erro ao carregar promoções:', error);
          toast({
            title: 'Erro',
            description: 'Erro ao carregar promoções',
            variant: 'destructive',
          });
        }
      },
      {
        queryKey: ['shipping-methods'],
        queryFn: async () => {
          if (!services?.shippingService) {
            throw new Error('Shipping service not available');
          }
          return services.shippingService.getShippingMethods();
        },
        enabled: loadShipping && !!services?.shippingService,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 2,
        onError: (error: any) => {
          console.error('Erro ao carregar métodos de frete:', error);
          toast({
            title: 'Erro',
            description: 'Erro ao carregar métodos de frete',
            variant: 'destructive',
          });
        }
      }
    ]
  });

  const [productsQuery, categoriesQuery, promotionsQuery, shippingQuery] = queries;

  return {
    // Products
    products: loadProducts ? (productsQuery.data || []) : [],
    isLoadingProducts: loadProducts ? productsQuery.isLoading : false,
    productsError: loadProducts ? productsQuery.error : null,

    // Categories
    categories: loadCategories ? (categoriesQuery.data || []) : [],
    isLoadingCategories: loadCategories ? categoriesQuery.isLoading : false,
    categoriesError: loadCategories ? categoriesQuery.error : null,

    // Promotions
    promotions: loadPromotions ? (promotionsQuery.data || []) : [],
    isLoadingPromotions: loadPromotions ? promotionsQuery.isLoading : false,
    promotionsError: loadPromotions ? promotionsQuery.error : null,

    // Shipping
    shippingMethods: loadShipping ? (shippingQuery.data || []) : [],
    isLoadingShipping: loadShipping ? shippingQuery.isLoading : false,
    shippingError: loadShipping ? shippingQuery.error : null,

    // Global states
    isLoading: queries.some(q => q.isLoading),
    hasError: queries.some(q => q.error),
    allLoaded: queries.every(q => !q.isLoading),
  };
}
