
import { Option } from './MultiSelectTypes';

export function validateMultiSelectProps(options: any, selected: any): {
  isValid: boolean;
  safeOptions: Option[];
  safeSelected: string[];
  errorMessage?: string;
} {
  console.log('🔧 MultiSelect validation - checking props:', { 
    options: typeof options, 
    selected: typeof selected,
    optionsIsArray: Array.isArray(options),
    selectedIsArray: Array.isArray(selected)
  });

  // Early return validation - validação crítica no início
  if (!Array.isArray(options) || !Array.isArray(selected)) {
    console.error('❌ MultiSelect - Invalid props:', { 
      options: typeof options, 
      selected: typeof selected,
      optionsIsArray: Array.isArray(options),
      selectedIsArray: Array.isArray(selected)
    });
    
    return {
      isValid: false,
      safeOptions: [],
      safeSelected: [],
      errorMessage: 'Options ou Selected não são arrays válidos'
    };
  }

  // Process safe options
  const safeOptions = options.filter(option => 
    option && 
    typeof option.value === 'string' && 
    typeof option.label === 'string' &&
    option.value.trim() &&
    option.label.trim()
  );

  // Process safe selected
  const safeSelected = selected.filter(item => 
    typeof item === 'string' && item.trim()
  );

  console.log('🔧 MultiSelect validation - processed:', {
    originalOptionsCount: options.length,
    safeOptionsCount: safeOptions.length,
    originalSelectedCount: selected.length,
    safeSelectedCount: safeSelected.length
  });

  return {
    isValid: true,
    safeOptions,
    safeSelected
  };
}

export function validateNewSelection(newSelected: any, safeOptions: Option[]): string[] {
  console.log('🔧 MultiSelect - Selection change requested:', newSelected);
  
  // Validações básicas
  if (!Array.isArray(newSelected)) {
    console.error('❌ MultiSelect - Invalid selection type:', typeof newSelected);
    return [];
  }

  // Filtrar apenas valores válidos que existem nas opções
  const validSelection = newSelected.filter(value => 
    typeof value === 'string' && 
    value.trim().length > 0 &&
    safeOptions.some(option => option.value === value)
  );
  
  console.log('🔧 MultiSelect - Valid selection processed:', validSelection);
  return validSelection;
}
