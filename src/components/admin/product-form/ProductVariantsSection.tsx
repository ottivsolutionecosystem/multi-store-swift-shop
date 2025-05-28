import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Trash2 } from 'lucide-react';
import { VariantData } from '@/services/VariantService';

interface ProductVariantsSectionProps {
  variants: VariantData[];
  onVariantsChange: (variants: VariantData[]) => void;
}

export function ProductVariantsSection({
  variants,
  onVariantsChange
}: ProductVariantsSectionProps) {
  const [newVariantName, setNewVariantName] = useState('');
  const [variantValues, setVariantValues] = useState<{ [key: number]: string }>({});

  const addVariant = () => {
    if (newVariantName.trim()) {
      const newVariant: VariantData = {
        name: newVariantName.trim(),
        values: []
      };
      onVariantsChange([...variants, newVariant]);
      setNewVariantName('');
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  const addValueToVariant = (variantIndex: number) => {
    const newValue = variantValues[variantIndex];
    if (newValue && newValue.trim() && !variants[variantIndex].values.includes(newValue.trim())) {
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].values.push(newValue.trim());
      onVariantsChange(updatedVariants);
      setVariantValues({ ...variantValues, [variantIndex]: '' });
    }
  };

  const removeValueFromVariant = (variantIndex: number, valueIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].values.splice(valueIndex, 1);
    onVariantsChange(updatedVariants);
  };

  const handleValueInputChange = (variantIndex: number, value: string) => {
    setVariantValues({ ...variantValues, [variantIndex]: value });
  };

  const handleValueKeyPress = (e: React.KeyboardEvent, variantIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValueToVariant(variantIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variantes do Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new variant */}
        <div>
          <Label>Adicionar Nova Opção</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Ex: Tamanho, Cor, Material..."
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addVariant()}
            />
            <Button type="button" onClick={addVariant} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Existing variants */}
        <div className="space-y-4">
          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{variant.name}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVariant(variantIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Add values to variant */}
              <div>
                <Label className="text-sm">Valores para {variant.name}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder={`Ex: ${variant.name === 'Tamanho' ? 'P, M, G' : variant.name === 'Cor' ? 'Preto, Branco' : 'Valor'}`}
                    value={variantValues[variantIndex] || ''}
                    onChange={(e) => handleValueInputChange(variantIndex, e.target.value)}
                    onKeyPress={(e) => handleValueKeyPress(e, variantIndex)}
                  />
                  <Button
                    type="button"
                    onClick={() => addValueToVariant(variantIndex)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Display values */}
              <div className="flex flex-wrap gap-2">
                {variant.values.map((value, valueIndex) => (
                  <Badge key={valueIndex} variant="outline" className="flex items-center gap-1">
                    {value}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeValueFromVariant(variantIndex, valueIndex)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {variants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma variante criada.</p>
            <p className="text-sm">Adicione opções como Tamanho, Cor, etc. para criar variantes do produto.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
