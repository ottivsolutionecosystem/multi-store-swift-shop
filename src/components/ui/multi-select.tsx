
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
  options = [],
  selected = [],
  onSelectionChange,
  placeholder = "Selecione itens...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Garantir arrays seguros sempre
  const safeSelected = useMemo(() => {
    const result = Array.isArray(selected) ? selected : [];
    console.log('🔧 MultiSelect - Safe selected:', result);
    return result;
  }, [selected]);

  const safeOptions = useMemo(() => {
    const result = Array.isArray(options) ? options : [];
    console.log('🔧 MultiSelect - Safe options count:', result.length);
    return result;
  }, [options]);

  const selectedOptions = useMemo(() => {
    if (!safeOptions.length || !safeSelected.length) {
      return [];
    }
    
    const result = safeOptions.filter((option) => {
      const isSelected = safeSelected.includes(option.value);
      return isSelected;
    });
    
    console.log('🔧 MultiSelect - Selected options:', result);
    return result;
  }, [safeOptions, safeSelected]);

  // Função com debounce e validação robusta
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
      
      console.log('🔧 MultiSelect - Valid selection:', validSelection);
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
    
    let newSelected: string[];
    if (safeSelected.includes(value)) {
      newSelected = safeSelected.filter((item) => item !== value);
      console.log('🔧 MultiSelect - Removing item:', value);
    } else {
      newSelected = [...safeSelected, value];
      console.log('🔧 MultiSelect - Adding item:', value);
    }
    
    handleSelectionChange(newSelected);
  }, [safeSelected, handleSelectionChange]);

  const handleRemove = useCallback((value: string) => {
    console.log('🔧 MultiSelect - Removing item:', value);
    
    if (!value || typeof value !== 'string') {
      console.error('❌ MultiSelect - Invalid value to remove:', value);
      return;
    }
    
    const newSelected = safeSelected.filter((item) => item !== value);
    handleSelectionChange(newSelected);
  }, [safeSelected, handleSelectionChange]);

  // Logs de debug para renderização
  console.log('🔧 MultiSelect render - options count:', safeOptions.length);
  console.log('🔧 MultiSelect render - selected count:', safeSelected.length);
  console.log('🔧 MultiSelect render - isProcessing:', isProcessing);

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
