
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

export default function CategoryFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const services = useServices();
  const { loading: tenantLoading } = useTenant();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: 'none', // Changed from empty string to 'none'
    image_url: ''
  });

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
        // Carregar categorias para o select de categoria pai
        const categoriesData = await services.categoryService.getAllCategories();
        // Filtrar categorias principais (sem parent_id) para evitar loops
        const mainCategories = categoriesData.filter(c => !c.parent_id);
        setCategories(mainCategories);

        // Se for edição, carregar categoria
        if (isEdit && id) {
          const category = await services.categoryService.getCategoryById(id);
          if (category) {
            setFormData({
              name: category.name,
              description: category.description || '',
              parent_id: category.parent_id || 'none', // Changed from empty string to 'none'
              image_url: category.image_url || ''
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados',
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, [services, tenantLoading, isEdit, id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!services) return;

    setLoading(true);
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description || null,
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id, // Convert 'none' back to null
        image_url: formData.image_url || null
      };

      if (isEdit && id) {
        await services.categoryService.updateCategory(id, categoryData);
        toast({
          title: 'Sucesso',
          description: 'Categoria atualizada com sucesso',
        });
      } else {
        await services.categoryService.createCategory(categoryData);
        toast({
          title: 'Sucesso',
          description: 'Categoria criada com sucesso',
        });
      }

      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar categoria',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/categories')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Categorias
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Categoria *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="parent">Categoria Pai</Label>
                  <Select 
                    value={formData.parent_id} 
                    onValueChange={(value) => setFormData({...formData, parent_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma (Categoria Principal)</SelectItem>
                      {categories
                        .filter(c => c.id !== id) // Evitar selecionar a própria categoria
                        .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/admin/categories')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')} Categoria
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagem da Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                bucket="category-images"
                folder="categories"
                value={formData.image_url}
                onChange={(url) => setFormData({...formData, image_url: url || ''})}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
