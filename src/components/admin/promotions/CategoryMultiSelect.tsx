
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

  // Validação robusta das categorias
  const safeCategories = useMemo(() => {
    console.log('🔧 CategoryMultiSelect - Processing categories:', categories);
    
    if (!Array.isArray(categories)) {
      console.warn('⚠️ CategoryMultiSelect - Categories is not an array:', typeof categories);
      return [];
    }
    
    const result = categories.filter(c => {
      const isValid = c && 
        typeof c.id === 'string' && 
        typeof c.name === 'string' && 
        c.id.trim() && 
        c.name.trim();
      
      if (!isValid) {
        console.warn('⚠️ CategoryMultiSelect - Invalid category filtered out:', c);
      }
      
      return isValid;
    });
    
    console.log('🔧 CategoryMultiSelect - Safe categories count:', result.length);
    return result;
  }, [categories]);

  const categoryOptions = useMemo(() => {
    console.log('🔧 CategoryMultiSelect - Creating options from categories:', safeCategories.length);
    
    const options = safeCategories.map(category => ({
      value: category.id,
      label: category.name
    }));
    
    console.log('🔧 CategoryMultiSelect - Category options created:', options);
    return options;
  }, [safeCategories]);

  const safeSelectedCategoryIds = useMemo(() => {
    console.log('🔧 CategoryMultiSelect - Processing selected IDs:', selectedCategoryIds);
    
    if (!Array.isArray(selectedCategoryIds)) {
      console.warn('⚠️ CategoryMultiSelect - Selected IDs not an array:', typeof selectedCategoryIds);
      return [];
    }
    
    const result = selectedCategoryIds.filter(id => 
      typeof id === 'string' && id.trim()
    );
    
    console.log('🔧 CategoryMultiSelect - Safe category IDs:', result);
    return result;
  }, [selectedCategoryIds]);

  const handleCategorySelection = useCallback((selected: string[]) => {
    console.log('🔧 CategoryMultiSelect - Selection handler called:', selected);
    
    try {
      // Validação adicional
      if (!Array.isArray(selected)) {
        console.error('❌ CategoryMultiSelect - Invalid selection type:', typeof selected);
        return;
      }
      
      const validSelection = selected.filter(id => 
        typeof id === 'string' && 
        id.trim() &&
        safeCategories.some(c => c.id === id) // Verificar se o ID existe nas categorias
      );
      
      console.log('🔧 CategoryMultiSelect - Valid selection processed:', validSelection);
      console.log('🔧 CategoryMultiSelect - Setting category_ids in form');
      
      setValue('category_ids', validSelection, { shouldValidate: true });
    } catch (error) {
      console.error('❌ CategoryMultiSelect - Error in selection:', error);
    }
  }, [setValue, safeCategories]);

  // Validação antes de renderizar o MultiSelect
  const shouldRenderMultiSelect = categoryOptions.length > 0 && Array.isArray(safeSelectedCategoryIds);

  console.log('🔧 CategoryMultiSelect render decision:', {
    shouldRender: shouldRenderMultiSelect,
    optionsCount: categoryOptions.length,
    selectedIsArray: Array.isArray(safeSelectedCategoryIds),
    selectedCount: safeSelectedCategoryIds.length
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="category_ids">Categorias *</Label>
      {shouldRenderMultiSelect ? (
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
          {safeCategories.length === 0 ? 'Carregando categorias...' : 'Erro ao carregar seleção de categorias'}
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
