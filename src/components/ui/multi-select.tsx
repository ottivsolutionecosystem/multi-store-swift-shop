
import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { MultiSelectTrigger } from './multi-select/MultiSelectTrigger';
import { MultiSelectDropdown } from './multi-select/MultiSelectDropdown';
import { validateMultiSelectProps, validateNewSelection } from './multi-select/MultiSelectValidation';
import { MultiSelectProps } from './multi-select/MultiSelectTypes';

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Selecione itens...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validate props early
  const validation = useMemo(() => validateMultiSelectProps(options, selected), [options, selected]);

  // Early return for invalid props
  if (!validation.isValid) {
    return (
      <div className={cn("w-full p-4 border rounded-md bg-red-50 text-red-700", className)}>
        <p className="text-sm font-medium">Erro: Props inválidas no MultiSelect</p>
        <p className="text-xs mt-1">{validation.errorMessage}</p>
      </div>
    );
  }

  const { safeOptions, safeSelected } = validation;

  console.log('🔧 MultiSelect render - Props validation passed:', {
    optionsCount: safeOptions.length,
    selectedCount: safeSelected.length
  });

  const selectedOptions = useMemo(() => {
    try {
      if (!safeOptions.length || !safeSelected.length) {
        return [];
      }
      
      const result = safeOptions.filter((option) => {
        const isSelected = safeSelected.includes(option.value);
        return isSelected;
      });
      
      console.log('🔧 MultiSelect - Selected options matched:', result);
      return result;
    } catch (error) {
      console.error('❌ MultiSelect - Error matching selected options:', error);
      return [];
    }
  }, [safeOptions, safeSelected]);

  // Função com validação robusta
  const handleSelectionChange = useCallback((newSelected: string[]) => {
    if (isProcessing) {
      console.log('⏳ MultiSelect - Already processing, skipping...');
      return;
    }

    setIsProcessing(true);
    
    try {
      const validSelection = validateNewSelection(newSelected, safeOptions);
      onSelectionChange(validSelection);
    } catch (error) {
      console.error('❌ MultiSelect - Error in selection change:', error);
    } finally {
      // Resetar processing após um pequeno delay
      setTimeout(() => setIsProcessing(false), 100);
    }
  }, [onSelectionChange, isProcessing, safeOptions]);

  const handleSelect = useCallback((value: string) => {
    console.log('🔧 MultiSelect - Item selected:', value, 'Current selected:', safeSelected);
    
    if (!value || typeof value !== 'string') {
      console.error('❌ MultiSelect - Invalid value selected:', value);
      return;
    }
    
    try {
      let newSelected: string[];
      if (safeSelected.includes(value)) {
        newSelected = safeSelected.filter((item) => item !== value);
        console.log('🔧 MultiSelect - Removing item:', value);
      } else {
        newSelected = [...safeSelected, value];
        console.log('🔧 MultiSelect - Adding item:', value);
      }
      
      handleSelectionChange(newSelected);
    } catch (error) {
      console.error('❌ MultiSelect - Error in handleSelect:', error);
    }
  }, [safeSelected, handleSelectionChange]);

  const handleRemove = useCallback((value: string) => {
    console.log('🔧 MultiSelect - Removing item:', value);
    
    if (!value || typeof value !== 'string') {
      console.error('❌ MultiSelect - Invalid value to remove:', value);
      return;
    }
    
    try {
      const newSelected = safeSelected.filter((item) => item !== value);
      handleSelectionChange(newSelected);
    } catch (error) {
      console.error('❌ MultiSelect - Error in handleRemove:', error);
    }
  }, [safeSelected, handleSelectionChange]);

  // Validação final antes de renderizar
  if (safeOptions.length === 0 && options.length > 0) {
    return (
      <div className={cn("w-full p-4 border rounded-md bg-yellow-50 text-yellow-700", className)}>
        <p className="text-sm font-medium">Aviso: Nenhuma opção válida encontrada</p>
        <p className="text-xs mt-1">Verifique se as opções têm value e label válidos</p>
      </div>
    );
  }

  console.log('🔧 MultiSelect final render - counts:', {
    safeOptionsCount: safeOptions.length,
    safeSelectedCount: safeSelected.length,
    selectedOptionsCount: selectedOptions.length,
    isProcessing
  });

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <MultiSelectTrigger
            selectedOptions={selectedOptions}
            placeholder={placeholder}
            isProcessing={isProcessing}
            onRemove={handleRemove}
          />
        </PopoverTrigger>
        <MultiSelectDropdown
          options={safeOptions}
          selected={safeSelected}
          onSelect={handleSelect}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
        />
      </Popover>
    </div>
  );
}
