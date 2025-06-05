
import React, { useState, useMemo, useCallback } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Selecione itens...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado",
  className,
}: MultiSelectProps) {
  // Early return validation - validação crítica no início
  if (!Array.isArray(options) || !Array.isArray(selected)) {
    console.error('❌ MultiSelect - Invalid props:', { 
      options: typeof options, 
      selected: typeof selected,
      optionsIsArray: Array.isArray(options),
      selectedIsArray: Array.isArray(selected)
    });
    return (
      <div className={cn("w-full p-4 border rounded-md bg-red-50 text-red-700", className)}>
        <p className="text-sm font-medium">Erro: Props inválidas no MultiSelect</p>
        <p className="text-xs mt-1">Options ou Selected não são arrays válidos</p>
      </div>
    );
  }

  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('🔧 MultiSelect render - Props validation passed:', {
    optionsCount: options.length,
    selectedCount: selected.length
  });

  // Garantir arrays seguros sempre
  const safeSelected = useMemo(() => {
    try {
      const result = Array.isArray(selected) ? selected.filter(item => 
        typeof item === 'string' && item.trim()
      ) : [];
      console.log('🔧 MultiSelect - Safe selected processed:', result);
      return result;
    } catch (error) {
      console.error('❌ MultiSelect - Error processing selected:', error);
      return [];
    }
  }, [selected]);

  const safeOptions = useMemo(() => {
    try {
      const result = Array.isArray(options) ? options.filter(option => 
        option && 
        typeof option.value === 'string' && 
        typeof option.label === 'string' &&
        option.value.trim() &&
        option.label.trim()
      ) : [];
      console.log('🔧 MultiSelect - Safe options processed:', result.length);
      return result;
    } catch (error) {
      console.error('❌ MultiSelect - Error processing options:', error);
      return [];
    }
  }, [options]);

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
    console.log('🔧 MultiSelect - Selection change requested:', newSelected);
    
    // Validações básicas
    if (!Array.isArray(newSelected)) {
      console.error('❌ MultiSelect - Invalid selection type:', typeof newSelected);
      return;
    }

    if (isProcessing) {
      console.log('⏳ MultiSelect - Already processing, skipping...');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Filtrar apenas valores válidos
      const validSelection = newSelected.filter(value => 
        typeof value === 'string' && value.trim().length > 0
      );
      
      console.log('🔧 MultiSelect - Valid selection processed:', validSelection);
      onSelectionChange(validSelection);
    } catch (error) {
      console.error('❌ MultiSelect - Error in selection change:', error);
    } finally {
      // Resetar processing após um pequeno delay
      setTimeout(() => setIsProcessing(false), 100);
    }
  }, [onSelectionChange, isProcessing]);

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
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-10 h-auto"
            disabled={isProcessing}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {safeSelected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedOptions.map((option) => (
                  <Badge
                    key={`badge-${option.value}`}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                    />
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border shadow-md z-50" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {safeOptions.map((option) => {
                const isSelected = safeSelected.includes(option.value);
                
                return (
                  <CommandItem
                    key={`option-${option.value}`}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
