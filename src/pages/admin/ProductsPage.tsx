
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { useProductManagement } from '@/hooks/useProductManagement';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import { ViewToggle } from '@/components/admin/products/ViewToggle';
import { ProductFiltersComponent } from '@/components/admin/products/ProductFilters';
import { ProductSortComponent } from '@/components/admin/products/ProductSort';
import { ProductListView } from '@/components/admin/products/ProductListView';
import { EmptyProductsState } from '@/components/admin/products/EmptyProductsState';
import { ProductWithPromotion } from '@/repositories/ProductRepository';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithPromotion[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const services = useServices();
  const { loading: tenantLoading } = useTenant();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    sort,
    setSort,
    filteredProducts
  } = useProductManagement(products);

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (tenantLoading || !services) return;

      try {
        const [productsData, categoriesData] = await Promise.all([
          services.productService.getAllProducts(),
          services.categoryService.getAllCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData.map(cat => ({ id: cat.id, name: cat.name })));
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [services, tenantLoading, toast]);

  const handleEdit = (productId: string) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleDelete = async (productId: string) => {
    if (!services || !confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await services.productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir produto',
        variant: 'destructive',
      });
    }
  };

  const handleCreateProduct = () => {
    navigate('/admin/products/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>
          {products.length > 0 && (
            <Button onClick={handleCreateProduct} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          )}
        </div>

        {products.length === 0 ? (
          <EmptyProductsState onCreateProduct={handleCreateProduct} />
        ) : (
          <div className="space-y-6">
            {/* Filtros */}
            <ProductFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />

            {/* Controles de visualização e ordenação */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <ProductSortComponent sort={sort} onSortChange={setSort} />
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>

            {/* Contador de resultados */}
            <div className="text-sm text-gray-600">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {/* Visualização dos produtos */}
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum produto encontrado com os filtros aplicados</p>
                </CardContent>
              </Card>
            ) : viewMode === 'list' ? (
              <ProductListView
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Cadastrados</CardTitle>
                  <CardDescription>
                    Gerencie os produtos da sua loja
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imagem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category?.name || 'Sem categoria'}</TableCell>
                          <TableCell>R$ {Number(product.price).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {product.stock_quantity}
                              {product.stock_quantity <= 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  Sem estoque
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                              {product.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(product.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
