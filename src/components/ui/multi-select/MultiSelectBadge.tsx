
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Option } from './MultiSelectTypes';

interface MultiSelectBadgeProps {
  option: Option;
  onRemove: (value: string) => void;
}

export function MultiSelectBadge({ option, onRemove }: MultiSelectBadgeProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(option.value);
  };

  return (
    <Badge
      key={`badge-${option.value}`}
      variant="secondary"
      className="text-xs"
    >
      {option.label}
      <X
        className="ml-1 h-3 w-3 cursor-pointer"
        onClick={handleRemove}
      />
    </Badge>
  );
}
