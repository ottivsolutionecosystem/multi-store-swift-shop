
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface GroupPriceHeaderProps {
  groupBy: string;
  groupValue: string;
  isExpanded: boolean;
  groupPrice: number | undefined;
  onToggle: () => void;
  onGroupPriceChange: (price: string) => void;
}

export function GroupPriceHeader({ 
  groupBy, 
  groupValue, 
  isExpanded, 
  groupPrice, 
  onToggle, 
  onGroupPriceChange 
}: GroupPriceHeaderProps) {
  return (
    <div className="p-4 bg-gray-50 border-b">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onToggle}
          className="flex items-center gap-2 p-0 h-auto font-medium"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          {groupBy}: {groupValue}
        </Button>
        
        <div className="flex items-center gap-2">
          <Label className="text-sm">Preço do grupo:</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={groupPrice || ''}
            onChange={(e) => onGroupPriceChange(e.target.value)}
            className="w-24"
            step="0.01"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
