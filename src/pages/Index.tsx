
import React, { useEffect, useState } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryNav } from '@/components/categories/CategoryNav';
import { ProductWithPromotion } from '@/types/product';

const Index = () => {
  const { store, loading: storeLoading } = useTenant();
  const { user, loading: authLoading } = useAuth();
  const services = useServices();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductWithPromotion[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  console.log('Index page - Store:', store);
  console.log('Index page - Store loading:', storeLoading);
  console.log('Index page - User:', user);
  console.log('Index page - Auth loading:', authLoading);

  useEffect(() => {
    const loadProducts = async () => {
      // Aguarda o tenant carregar e os serviços estarem disponíveis
      if (storeLoading || !services) {
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
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [services, storeLoading, selectedCategoryId, toast]);

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Carregando loja...</h2>
          <p className="text-gray-600">Detectando configurações do domínio</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">Erro na Configuração</h1>
          <p className="text-xl text-gray-600 mb-4">
            Não foi possível carregar a configuração da loja para este domínio.
          </p>
          <p className="text-gray-500">
            Domínio atual: {window.location?.host || 'desconhecido'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo à {store.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Descubra nossos produtos incríveis
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
            {productsLoading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg h-64"></div>
                  ))}
                </div>
              </div>
            ) : products.length === 0 ? (
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

        {/* Informações da Loja */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Informações da Loja</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>ID:</strong> {store.id}</p>
            <p><strong>Nome:</strong> {store.name}</p>
            <p><strong>Domínio:</strong> {store.domain}</p>
            {store.custom_domain && (
              <p><strong>Domínio Personalizado:</strong> {store.custom_domain}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
