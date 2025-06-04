import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryNav } from '@/components/categories/CategoryNav';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { ProductWithPromotion } from '@/repositories/ProductRepository';

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

  const handleAddToCart = (product: ProductWithPromotion & { finalPrice?: number }) => {
    // Calcular o preço correto baseado na hierarquia de promoções
    let finalPrice: number;
    let promotionInfo = '';
    
    if (product.finalPrice) {
      // Se o finalPrice foi calculado no ProductCard, usar ele
      finalPrice = product.finalPrice;
    } else if (product.promotion) {
      if (product.promotion.compare_at_price) {
        // Caso: Preço Comparativo - usar o preço atual do produto
        finalPrice = product.price;
        promotionInfo = ' (Oferta Especial)';
      } else {
        // Caso: Promoção ativa - usar o preço promocional
        finalPrice = product.promotion.promotional_price;
        const typeLabel = {
          'global': 'Promoção Global',
          'category': 'Promoção de Categoria',
          'product': 'Promoção do Produto'
        }[product.promotion.promotion_type] || 'Promoção';
        
        promotionInfo = ` (${typeLabel})`;
      }
    } else {
      // Caso: Sem promoção - usar preço normal
      finalPrice = product.price;
    }

    toast({
      title: 'Produto adicionado',
      description: `${product.name} foi adicionado ao carrinho por ${finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}${promotionInfo}`,
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo à {store?.name}
          </h1>
          <p className="text-gray-600">
            Descubra nossos produtos incríveis de perfumaria para casa e sabonetes artesanais
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
                    onAddToCart={handleAddToCart}
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
