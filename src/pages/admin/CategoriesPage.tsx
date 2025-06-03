
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryDrawer } from '@/components/admin/categories/CategoryDrawer';
import { CategoryCard } from '@/components/admin/categories/CategoryCard';
import { CategoryBreadcrumb } from '@/components/admin/categories/CategoryBreadcrumb';
import { Plus, Search, Tag, Grid, List, ArrowLeft } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

function CategoriesPage() {
  console.log('CategoriesPage component loaded');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);

  const { user, profile } = useAuth();
  const services = useServices();
  const { loading: tenantLoading, storeId } = useTenant();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('CategoriesPage - storeId:', storeId, 'services:', !!services, 'tenantLoading:', tenantLoading);

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const loadCategories = async () => {
      console.log('Tentando carregar categorias...', { tenantLoading, services: !!services, storeId });
      
      if (tenantLoading) {
        console.log('Ainda carregando tenant...');
        return;
      }

      if (!storeId) {
        console.log('Nenhum storeId disponível, carregando array vazio');
        setCategories([]);
        setFilteredCategories([]);
        setLoading(false);
        return;
      }

      if (!services) {
        console.log('Serviços não disponíveis ainda...');
        return;
      }

      try {
        console.log('Carregando categorias para store:', storeId);
        const categoriesData = await services.categoryService.getAllCategories();
        console.log('Categorias carregadas:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar categorias',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [services, tenantLoading, storeId, toast]);

  useEffect(() => {
    // Filter categories based on current navigation level
    let categoriesToFilter = categories;
    
    if (currentParentId) {
      // Show subcategories of the selected parent
      categoriesToFilter = categories.filter(cat => cat.parent_id === currentParentId);
    } else {
      // Show only main categories (no parent_id)
      categoriesToFilter = categories.filter(cat => !cat.parent_id);
    }

    // Apply search filter
    const filtered = categoriesToFilter.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredCategories(filtered);
  }, [searchTerm, categories, currentParentId]);

  const handleDelete = async (categoryId: string) => {
    if (!services || !confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await services.categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      toast({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir categoria',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDrawerOpen(true);
  };

  const handleNew = () => {
    if (!storeId) {
      toast({
        title: 'Erro',
        description: 'Store não disponível. Verifique a configuração.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedCategory(null);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    // Recarregar categorias após salvar
    try {
      const categoriesData = await services?.categoryService.getAllCategories();
      if (categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error reloading categories:', error);
    }
  };

  const handleNavigateToCategory = (categoryId: string) => {
    setCurrentParentId(categoryId);
    setSearchTerm(''); // Clear search when navigating
  };

  const handleNavigateToRoot = () => {
    setCurrentParentId(null);
    setSearchTerm(''); // Clear search when going back to root
  };

  const getCurrentCategory = () => {
    return currentParentId ? categories.find(cat => cat.id === currentParentId) : undefined;
  };

  const getSubcategories = (parentId: string) => 
    categories.filter(c => c.parent_id === parentId);

  const getDisplayCategories = () => {
    return filteredCategories.map(category => ({
      category,
      subcategories: getSubcategories(category.id)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = getCurrentCategory();
  const displayCategories = getDisplayCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <CategoryBreadcrumb 
          currentCategory={currentCategory}
          onNavigateToRoot={handleNavigateToRoot}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4">
              {currentParentId && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNavigateToRoot}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentCategory ? `Subcategorias de ${currentCategory.name}` : 'Gerenciar Categorias'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {currentCategory 
                    ? 'Gerencie as subcategorias desta categoria'
                    : 'Organize seus produtos em categorias'
                  }
                </p>
              </div>
            </div>
            {!storeId && (
              <p className="text-red-600 mt-1 text-sm">
                ⚠️ Store não configurada. Algumas funcionalidades podem não estar disponíveis.
              </p>
            )}
          </div>
          <Button onClick={handleNew} className="flex items-center gap-2" disabled={!storeId}>
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        {/* Filtros e busca */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm 
                  ? 'Nenhuma categoria encontrada' 
                  : currentCategory 
                    ? 'Nenhuma subcategoria cadastrada'
                    : 'Nenhuma categoria cadastrada'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente buscar com outros termos' 
                  : currentCategory
                    ? `Comece criando a primeira subcategoria para ${currentCategory.name}`
                    : 'Comece criando sua primeira categoria para organizar seus produtos'
                }
              </p>
              {!searchTerm && storeId && (
                <Button onClick={handleNew} variant="outline">
                  {currentCategory ? 'Criar primeira subcategoria' : 'Criar primeira categoria'}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {displayCategories.map(({ category, subcategories }) => (
              <CategoryCard
                key={category.id}
                category={category}
                subcategories={subcategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNavigate={!currentParentId ? handleNavigateToCategory : undefined}
                parentCategory={currentCategory}
              />
            ))}
          </div>
        )}

        <CategoryDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          category={selectedCategory}
          categories={categories}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}

export default CategoriesPage;
