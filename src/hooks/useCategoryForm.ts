
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryFormData {
  name: string;
  description: string;
  parent_id: string;
  image_url: string;
}

export function useCategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const services = useServices();
  const { loading: tenantLoading } = useTenant();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parent_id: 'none',
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
        const categoriesData = await services.categoryService.getAllCategories();
        const mainCategories = categoriesData.filter(c => !c.parent_id);
        setCategories(mainCategories);

        if (isEdit && id) {
          const category = await services.categoryService.getCategoryById(id);
          if (category) {
            setFormData({
              name: category.name,
              description: category.description || '',
              parent_id: category.parent_id || 'none',
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
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id,
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

  const updateFormData = (updates: Partial<CategoryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    updateFormData,
    categories,
    loading,
    isEdit,
    handleSubmit,
    navigate
  };
}
