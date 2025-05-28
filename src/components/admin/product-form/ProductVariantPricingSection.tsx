
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CombinationWithValues, GroupPriceWithValue } from '@/repositories/VariantRepository';

interface ProductVariantPricingSectionProps {
  combinations: CombinationWithValues[];
  groupPrices: GroupPriceWithValue[];
  onCombinationUpdate: (combinationId: string, updates: any) => void;
  onGroupPriceUpdate: (variantValueId: string, price: number) => void;
}

export function ProductVariantPricingSection({
  combinations,
  groupPrices,
  onCombinationUpdate,
  onGroupPriceUpdate
}: ProductVariantPricingSectionProps) {
  const [groupBy, setGroupBy] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [groupedCombinations, setGroupedCombinations] = useState<{ [key: string]: CombinationWithValues[] }>({});

  // Get available variant names for grouping
  const availableVariants = React.useMemo(() => {
    const variants = new Set<string>();
    combinations.forEach(combination => {
      combination.values.forEach(value => {
        variants.add(value.variant_name);
      });
    });
    return Array.from(variants);
  }, [combinations]);

  // Group combinations by selected variant
  useEffect(() => {
    if (!groupBy || combinations.length === 0) {
      setGroupedCombinations({});
      return;
    }

    const groups: { [key: string]: CombinationWithValues[] } = {};
    
    combinations.forEach(combination => {
      const groupValue = combination.values.find(v => v.variant_name === groupBy);
      if (groupValue) {
        const groupKey = groupValue.value;
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(combination);
      }
    });

    setGroupedCombinations(groups);
  }, [combinations, groupBy]);

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getGroupPrice = (groupValue: string): number | undefined => {
    const groupPrice = groupPrices.find(gp => 
      gp.variant_value.value === groupValue && 
      gp.variant_value.variant.name === groupBy
    );
    return groupPrice?.group_price || undefined;
  };

  const handleGroupPriceChange = (groupValue: string, price: string) => {
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice) && numPrice >= 0) {
      // Find the variant value ID for this group
      const variantValueId = combinations.find(combination =>
        combination.values.find(v => v.variant_name === groupBy && v.value === groupValue)
      )?.values.find(v => v.variant_name === groupBy && v.value === groupValue)?.id;

      if (variantValueId) {
        onGroupPriceUpdate(variantValueId, numPrice);
      }
    }
  };

  const formatCombinationLabel = (combination: CombinationWithValues) => {
    return combination.values
      .filter(v => v.variant_name !== groupBy)
      .map(v => `${v.variant_name}: ${v.value}`)
      .join(' / ');
  };

  if (combinations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preços e Estoque das Variantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma combinação de variante disponível.</p>
            <p className="text-sm">Crie variantes primeiro para gerenciar preços e estoque.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços e Estoque das Variantes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Group by selector */}
        <div>
          <Label>Agrupar por</Label>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção para agrupar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Não agrupar</SelectItem>
              {availableVariants.map(variant => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grouped view */}
        {groupBy && Object.keys(groupedCombinations).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedCombinations).map(([groupValue, groupCombinations]) => (
              <div key={groupValue} className="border rounded-lg">
                {/* Group header */}
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => toggleGroup(groupValue)}
                      className="flex items-center gap-2 p-0 h-auto font-medium"
                    >
                      {expandedGroups.has(groupValue) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      {groupBy}: {groupValue}
                    </Button>
                    
                    {/* Group price input */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Preço do grupo:</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={getGroupPrice(groupValue) || ''}
                        onChange={(e) => handleGroupPriceChange(groupValue, e.target.value)}
                        className="w-24"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Group combinations */}
                {expandedGroups.has(groupValue) && (
                  <div className="p-4 space-y-3">
                    {groupCombinations.map(combination => (
                      <div key={combination.id} className="flex items-center gap-4 p-3 border rounded">
                        <div className="flex-1">
                          <span className="text-sm font-medium">
                            {formatCombinationLabel(combination) || 'Combinação base'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div>
                            <Label className="text-xs">Preço</Label>
                            <Input
                              type="number"
                              placeholder="Usar preço do grupo"
                              value={combination.price || ''}
                              onChange={(e) => onCombinationUpdate(combination.id, { 
                                price: e.target.value ? parseFloat(e.target.value) : null 
                              })}
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
                              onChange={(e) => onCombinationUpdate(combination.id, { 
                                stock_quantity: parseInt(e.target.value) || 0 
                              })}
                              className="w-20"
                              min="0"
                            />
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={combination.is_active}
                              onCheckedChange={(checked) => onCombinationUpdate(combination.id, { 
                                is_active: checked 
                              })}
                            />
                            <Label className="text-xs">Ativo</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Ungrouped view */
          <div className="space-y-3">
            {combinations.map(combination => (
              <div key={combination.id} className="flex items-center gap-4 p-3 border rounded">
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {combination.values.map(v => `${v.variant_name}: ${v.value}`).join(' / ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div>
                    <Label className="text-xs">SKU</Label>
                    <Input
                      placeholder="SKU"
                      value={combination.sku || ''}
                      onChange={(e) => onCombinationUpdate(combination.id, { sku: e.target.value })}
                      className="w-24"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Preço</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={combination.price || ''}
                      onChange={(e) => onCombinationUpdate(combination.id, { 
                        price: e.target.value ? parseFloat(e.target.value) : null 
                      })}
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
                      onChange={(e) => onCombinationUpdate(combination.id, { 
                        stock_quantity: parseInt(e.target.value) || 0 
                      })}
                      className="w-20"
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={combination.is_active}
                      onCheckedChange={(checked) => onCombinationUpdate(combination.id, { 
                        is_active: checked 
                      })}
                    />
                    <Label className="text-xs">Ativo</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
