
import React, { useMemo, useCallback } from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { PromotionFormData } from '@/types/promotion';

interface CategoryMultiSelectProps {
  setValue: UseFormSetValue<PromotionFormData>;
  watch: UseFormWatch<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
  categories: any[];
}

export function CategoryMultiSelect({ setValue, watch, errors, categories = [] }: CategoryMultiSelectProps) {
  const selectedCategoryIds = watch('category_ids') || [];

  const safeCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      console.warn('⚠️ CategoryMultiSelect - Categories is not an array:', categories);
      return [];
    }
    const result = categories.filter(c => c && c.id && c.name);
    console.log('🔧 CategoryMultiSelect - Safe categories count:', result.length);
    return result;
  }, [categories]);

  const categoryOptions = useMemo(() => {
    const options = safeCategories.map(category => ({
      value: category.id,
      label: category.name
    }));
    console.log('🔧 CategoryMultiSelect - Category options created:', options.length);
    return options;
  }, [safeCategories]);

  const safeSelectedCategoryIds = useMemo(() => {
    const result = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [];
    console.log('🔧 CategoryMultiSelect - Safe category IDs:', result);
    return result;
  }, [selectedCategoryIds]);

  const handleCategorySelection = useCallback((selected: string[]) => {
    console.log('🔧 CategoryMultiSelect - Selection handler called:', selected);
    
    try {
      if (!Array.isArray(selected)) {
        console.error('❌ CategoryMultiSelect - Invalid selection:', selected);
        return;
      }
      
      const validSelection = selected.filter(id => typeof id === 'string' && id.trim());
      console.log('🔧 CategoryMultiSelect - Setting category_ids:', validSelection);
      
      setValue('category_ids', validSelection, { shouldValidate: true });
    } catch (error) {
      console.error('❌ CategoryMultiSelect - Error in selection:', error);
    }
  }, [setValue]);

  return (
    <div className="space-y-2">
      <Label htmlFor="category_ids">Categorias *</Label>
      {categoryOptions.length > 0 ? (
        <MultiSelect
          options={categoryOptions}
          selected={safeSelectedCategoryIds}
          onSelectionChange={handleCategorySelection}
          placeholder="Selecione as categorias..."
          searchPlaceholder="Buscar categorias..."
          emptyText="Nenhuma categoria encontrada"
        />
      ) : (
        <div className="p-4 text-center text-gray-500 border rounded-md">
          Carregando categorias...
        </div>
      )}
      {errors.category_ids && (
        <p className="text-sm text-red-600">{errors.category_ids.message}</p>
      )}
      <p className="text-sm text-gray-500">
        Selecione uma ou mais categorias para aplicar a promoção
      </p>
    </div>
  );
}
