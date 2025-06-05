
export interface Option {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export interface MultiSelectValidationResult {
  isValid: boolean;
  safeOptions: Option[];
  safeSelected: string[];
  errorMessage?: string;
}
