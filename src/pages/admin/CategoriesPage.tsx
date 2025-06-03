
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
import { Plus, Search, Tag, Grid, List } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { user, profile } = useAuth();
  const services = useServices();
  const { loading: tenantLoading } = useTenant();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const loadCategories = async () => {
      if (tenantLoading || !services) return;

      try {
        const categoriesData = await services.categoryService.getAllCategories();
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
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
  }, [services, tenantLoading, toast]);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

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

  const mainCategories = filteredCategories.filter(c => !c.parent_id);
  const getSubcategories = (parentId: string) => 
    filteredCategories.filter(c => c.parent_id === parentId);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>
            <p className="text-gray-600 mt-1">Organize seus produtos em categorias</p>
          </div>
          <Button onClick={handleNew} className="flex items-center gap-2">
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
                {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente buscar com outros termos' 
                  : 'Comece criando sua primeira categoria para organizar seus produtos'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleNew} variant="outline">
                  Criar primeira categoria
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
            {mainCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                subcategories={getSubcategories(category.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
