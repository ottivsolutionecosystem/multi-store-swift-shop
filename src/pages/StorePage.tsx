
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryNav } from '@/components/categories/CategoryNav';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { ProductWithPromotion } from '@/types/product';

export default function StorePage() {
  const [products, setProducts] = useState<ProductWithPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const services = useServices();
  const { store, loading: tenantLoading } = useTenant();
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      // Aguarda o tenant carregar e os serviços estarem disponíveis
      if (tenantLoading || !services) {
        return;
      }

      try {
        let productsData: ProductWithPromotion[];
        
        if (selectedCategoryId) {
          // Carregar produtos da categoria selecionada, incluindo subcategorias
          productsData = await services.productService.getProductsByCategoryWithSubcategories(selectedCategoryId);
        } else {
          // Carregar todos os produtos
          productsData = await services.productService.getAllProducts();
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar produtos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [services, tenantLoading, selectedCategoryId, toast]);

  if (tenantLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Aplicar cores personalizadas via CSS variables se disponíveis
  const storeSettings = store?.store_settings;
  const customStyles = storeSettings ? {
    '--primary-color': storeSettings.primary_color || '#3b82f6',
    '--secondary-color': storeSettings.secondary_color || '#6b7280',
    '--price-color': storeSettings.price_color || '#16a34a',
  } as React.CSSProperties : {};

  return (
    <div className="min-h-screen bg-gray-50" style={customStyles}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo à {store?.name}
          </h1>
          <p className="text-gray-600">
            {storeSettings?.store_description || 'Descubra nossos produtos incríveis de perfumaria para casa e sabonetes artesanais'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navegação de Categorias */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h2>
              <CategoryNav 
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
              />
            </div>
          </aside>

          {/* Lista de Produtos */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategoryId 
                    ? 'Nenhum produto encontrado nesta categoria' 
                    : 'Nenhum produto disponível no momento'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
