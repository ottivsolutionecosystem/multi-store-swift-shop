
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  PopoverContent,
} from '@/components/ui/popover';
import { Option } from './MultiSelectTypes';

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onSelect: (value: string) => void;
  searchPlaceholder: string;
  emptyText: string;
}

export function MultiSelectDropdown({ 
  options, 
  selected, 
  onSelect, 
  searchPlaceholder, 
  emptyText 
}: MultiSelectDropdownProps) {
  return (
    <PopoverContent className="w-full p-0 bg-white border shadow-md z-50" align="start">
      <Command>
        <CommandInput placeholder={searchPlaceholder} />
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup className="max-h-64 overflow-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            
            return (
              <CommandItem
                key={`option-${option.value}`}
                onSelect={() => onSelect(option.value)}
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
  );
}
