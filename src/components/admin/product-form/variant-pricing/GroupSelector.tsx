
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GroupSelectorProps {
  groupBy: string;
  availableVariants: string[];
  onGroupByChange: (value: string) => void;
}

export function GroupSelector({ groupBy, availableVariants, onGroupByChange }: GroupSelectorProps) {
  return (
    <div>
      <Label>Agrupar por</Label>
      <Select value={groupBy} onValueChange={onGroupByChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma opção para agrupar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Não agrupar</SelectItem>
          {availableVariants.map(variant => (
            <SelectItem key={variant} value={variant}>
              {variant}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
