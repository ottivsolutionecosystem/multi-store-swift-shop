
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CepInputProps {
  onCepCalculate: (cep: string) => Promise<void>;
  onUseCustomAddress: (use: boolean) => void;
  calculating: boolean;
}

export function CepInput({ onCepCalculate, onUseCustomAddress, calculating }: CepInputProps) {
  const [cep, setCep] = useState('');

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    } else {
      return cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
  };

  const handleCalculate = () => {
    if (cep.trim()) {
      onCepCalculate(cep);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cep">CEP de Entrega</Label>
        <Input
          id="cep"
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          maxLength={9}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={handleCalculate}
          disabled={!cep.trim() || calculating}
          className="flex-1"
        >
          {calculating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Frete'
          )}
        </Button>
        
        <Button 
          type="button"
          variant="outline"
          onClick={() => onUseCustomAddress(true)}
        >
          Endereço Personalizado
        </Button>
      </div>
    </div>
  );
}
