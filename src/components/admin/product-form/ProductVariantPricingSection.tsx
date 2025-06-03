
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CombinationWithValues, GroupPriceWithValue } from '@/repositories/VariantRepository';
import { GroupSelector } from './variant-pricing/GroupSelector';
import { GroupPriceHeader } from './variant-pricing/GroupPriceHeader';
import { CombinationItem } from './variant-pricing/CombinationItem';
import { GroupCombinationItem } from './variant-pricing/GroupCombinationItem';

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
  const [groupBy, setGroupBy] = useState<string>('none');
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
    if (groupBy === 'none' || !groupBy || combinations.length === 0) {
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
        <GroupSelector
          groupBy={groupBy}
          availableVariants={availableVariants}
          onGroupByChange={setGroupBy}
        />

        {/* Grouped view */}
        {groupBy !== 'none' && groupBy && Object.keys(groupedCombinations).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedCombinations).map(([groupValue, groupCombinations]) => (
              <div key={groupValue} className="border rounded-lg">
                <GroupPriceHeader
                  groupBy={groupBy}
                  groupValue={groupValue}
                  isExpanded={expandedGroups.has(groupValue)}
                  groupPrice={getGroupPrice(groupValue)}
                  onToggle={() => toggleGroup(groupValue)}
                  onGroupPriceChange={(price) => handleGroupPriceChange(groupValue, price)}
                />

                {expandedGroups.has(groupValue) && (
                  <div className="p-4 space-y-3">
                    {groupCombinations.map(combination => (
                      <GroupCombinationItem
                        key={combination.id}
                        combination={combination}
                        groupBy={groupBy}
                        onUpdate={onCombinationUpdate}
                      />
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
              <CombinationItem
                key={combination.id}
                combination={combination}
                showSku={true}
                onUpdate={onCombinationUpdate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
