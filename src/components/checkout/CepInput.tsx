
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputMask } from '@/components/ui/input-mask';

interface CepInputProps {
  onCepCalculate: (cep: string) => void;
  onUseCustomAddress: (use: boolean) => void;
  calculating: boolean;
}

export function CepInput({ onCepCalculate, onUseCustomAddress, calculating }: CepInputProps) {
  const [cep, setCep] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value;
    setCep(newCep);
    
    // Auto-calculate shipping when CEP is complete
    if (newCep.replace(/\D/g, '').length === 8) {
      onCepCalculate(newCep);
    }
  };

  const handleCustomAddressChange = (checked: boolean) => {
    setUseCustomAddress(checked);
    onUseCustomAddress(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calcular Frete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cep">CEP de Entrega</Label>
          <div className="flex gap-2">
            <InputMask
              mask="cep"
              id="cep"
              placeholder="00000-000"
              value={cep}
              onChange={handleCepChange}
            />
            <Button 
              onClick={() => onCepCalculate(cep)}
              disabled={calculating || !cep.trim()}
              variant="outline"
            >
              {calculating ? 'Calculando...' : 'Calcular'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="custom-address"
            checked={useCustomAddress}
            onChange={(e) => handleCustomAddressChange(e.target.checked)}
          />
          <Label htmlFor="custom-address">
            Informar endereço completo de entrega
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
