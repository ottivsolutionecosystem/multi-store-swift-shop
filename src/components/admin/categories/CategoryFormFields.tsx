
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryFormFieldsProps {
  formData: {
    name: string;
    description: string;
    parent_id: string;
    image_url: string;
  };
  categories: Category[];
  loading: boolean;
  isEdit: boolean;
  categoryId?: string;
  onFormDataChange: (updates: Partial<{ name: string; description: string; parent_id: string; image_url: string }>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CategoryFormFields({
  formData,
  categories,
  loading,
  isEdit,
  categoryId,
  onFormDataChange,
  onSubmit,
  onCancel
}: CategoryFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Categoria *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="parent">Categoria Pai</Label>
        <Select 
          value={formData.parent_id} 
          onValueChange={(value) => onFormDataChange({ parent_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma (Categoria Principal)</SelectItem>
            {categories
              .filter(c => c.id !== categoryId)
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
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')} Categoria
        </Button>
      </div>
    </form>
  );
}
