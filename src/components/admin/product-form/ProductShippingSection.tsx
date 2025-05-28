
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProductShippingSectionProps {
  weight: string;
  onWeightChange: (value: string) => void;
}

export function ProductShippingSection({
  weight,
  onWeightChange
}: ProductShippingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.001"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="Peso do produto para cálculo de frete"
          />
        </div>
      </CardContent>
    </Card>
  );
}
