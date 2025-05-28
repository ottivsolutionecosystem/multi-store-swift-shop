
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProductPricingSectionProps {
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  onPriceChange: (value: string) => void;
  onCompareAtPriceChange: (value: string) => void;
  onCostPerItemChange: (value: string) => void;
}

export function ProductPricingSection({
  price,
  compareAtPrice,
  costPerItem,
  onPriceChange,
  onCompareAtPriceChange,
  onCostPerItemChange
}: ProductPricingSectionProps) {
  const calculateProfit = () => {
    const priceNum = parseFloat(price) || 0;
    const costNum = parseFloat(costPerItem) || 0;
    if (priceNum > 0 && costNum > 0) {
      return priceNum - costNum;
    }
    return 0;
  };

  const calculateMargin = () => {
    const priceNum = parseFloat(price) || 0;
    const costNum = parseFloat(costPerItem) || 0;
    if (priceNum > 0 && costNum > 0) {
      return ((priceNum - costNum) / priceNum) * 100;
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="compare_at_price">Preço Comparativo (R$)</Label>
            <Input
              id="compare_at_price"
              type="number"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => onCompareAtPriceChange(e.target.value)}
              placeholder="Preço original para mostrar desconto"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cost_per_item">Custo por Item (R$)</Label>
          <Input
            id="cost_per_item"
            type="number"
            step="0.01"
            value={costPerItem}
            onChange={(e) => onCostPerItemChange(e.target.value)}
            placeholder="Seu custo para este produto"
          />
        </div>

        {(parseFloat(price) > 0 && parseFloat(costPerItem) > 0) && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="text-gray-600">Lucro:</span>
              <div className="font-semibold text-green-600">
                R$ {calculateProfit().toFixed(2)}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Margem:</span>
              <div className="font-semibold text-green-600">
                {calculateMargin().toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
