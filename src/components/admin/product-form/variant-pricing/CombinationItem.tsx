
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CombinationWithValues } from '@/repositories/VariantRepository';

interface CombinationItemProps {
  combination: CombinationWithValues;
  showSku?: boolean;
  onUpdate: (combinationId: string, updates: any) => void;
}

export function CombinationItem({ combination, showSku = true, onUpdate }: CombinationItemProps) {
  const formatCombinationLabel = (combination: CombinationWithValues) => {
    return combination.values.map(v => `${v.variant_name}: ${v.value}`).join(' / ');
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded">
      <div className="flex-1">
        <span className="text-sm font-medium">
          {formatCombinationLabel(combination)}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {showSku && (
          <div>
            <Label className="text-xs">SKU</Label>
            <Input
              placeholder="SKU"
              value={combination.sku || ''}
              onChange={(e) => {
                console.log('Updating SKU for combination:', combination.id, 'new value:', e.target.value);
                onUpdate(combination.id, { sku: e.target.value });
              }}
              className="w-24"
            />
          </div>
        )}
        
        <div>
          <Label className="text-xs">Preço</Label>
          <Input
            type="number"
            placeholder={showSku ? "0.00" : "Usar preço do grupo"}
            value={combination.price || ''}
            onChange={(e) => {
              console.log('Updating price for combination:', combination.id, 'new value:', e.target.value);
              onUpdate(combination.id, { 
                price: e.target.value ? parseFloat(e.target.value) : null 
              });
            }}
            className="w-24"
            step="0.01"
            min="0"
          />
        </div>
        
        <div>
          <Label className="text-xs">Estoque</Label>
          <Input
            type="number"
            value={combination.stock_quantity}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              console.log('Updating stock for combination:', combination.id, 'new value:', newValue);
              onUpdate(combination.id, { 
                stock_quantity: newValue
              });
            }}
            className="w-20"
            min="0"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <Switch
            checked={combination.is_active}
            onCheckedChange={(checked) => {
              console.log('Updating active status for combination:', combination.id, 'new value:', checked);
              onUpdate(combination.id, { 
                is_active: checked 
              });
            }}
          />
          <Label className="text-xs">Ativo</Label>
        </div>
      </div>
    </div>
  );
}
