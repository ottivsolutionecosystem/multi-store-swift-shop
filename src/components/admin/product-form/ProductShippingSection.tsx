
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProductShippingSectionProps {
  weight: string;
  length: string;
  width: string;
  height: string;
  onWeightChange: (value: string) => void;
  onLengthChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
}

export function ProductShippingSection({
  weight,
  length,
  width,
  height,
  onWeightChange,
  onLengthChange,
  onWidthChange,
  onHeightChange
}: ProductShippingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.001"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              placeholder="0.000"
            />
          </div>
          <div>
            <Label htmlFor="length">Comprimento (cm)</Label>
            <Input
              id="length"
              type="number"
              step="0.1"
              value={length}
              onChange={(e) => onLengthChange(e.target.value)}
              placeholder="0.0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="width">Largura (cm)</Label>
            <Input
              id="width"
              type="number"
              step="0.1"
              value={width}
              onChange={(e) => onWidthChange(e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div>
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => onHeightChange(e.target.value)}
              placeholder="0.0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
