
import React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MultiSelectBadge } from './MultiSelectBadge';
import { Option } from './MultiSelectTypes';

interface MultiSelectTriggerProps {
  selectedOptions: Option[];
  placeholder: string;
  isProcessing: boolean;
  onRemove: (value: string) => void;
  className?: string;
}

export function MultiSelectTrigger({ 
  selectedOptions, 
  placeholder, 
  isProcessing, 
  onRemove,
  className 
}: MultiSelectTriggerProps) {
  return (
    <Button
      variant="outline"
      role="combobox"
      className={cn("w-full justify-between min-h-10 h-auto", className)}
      disabled={isProcessing}
    >
      <div className="flex flex-wrap gap-1 flex-1">
        {selectedOptions.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          selectedOptions.map((option) => (
            <MultiSelectBadge
              key={option.value}
              option={option}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}
