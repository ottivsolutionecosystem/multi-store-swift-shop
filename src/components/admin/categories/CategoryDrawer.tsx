
import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  onSave: () => void;
}

export function CategoryDrawer({ open, onOpenChange, category, categories, onSave }: CategoryDrawerProps) {
  const services = useServices();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: 'none', // Changed from empty string to 'none'
    image_url: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id || 'none', // Changed from empty string to 'none'
        image_url: category.image_url || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        parent_id: 'none', // Changed from empty string to 'none'
        image_url: ''
      });
    }
  }, [category, open]);

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

      if (category) {
        await services.categoryService.updateCategory(category.id, categoryData);
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

      onSave();
      onOpenChange(false);
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

  const mainCategories = categories.filter(c => !c.parent_id && c.id !== category?.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </SheetTitle>
          <SheetDescription>
            {category ? 'Atualize as informações da categoria' : 'Adicione uma nova categoria ao seu catálogo'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Categoria *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Eletrônicos, Roupas..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição da categoria..."
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
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Imagem da Categoria</Label>
              <ImageUpload
                bucket="category-images"
                folder="categories"
                value={formData.image_url}
                onChange={(url) => setFormData({...formData, image_url: url || ''})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (category ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
