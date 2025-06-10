
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CepInputProps {
  cep: string;
  onCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CepInput({ cep, onCepChange }: CepInputProps) {
  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    } else {
      return cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    e.target.value = formattedCep;
    onCepChange(e);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cep">CEP de Entrega</Label>
      <Input
        id="cep"
        type="text"
        placeholder="00000-000"
        value={cep}
        onChange={handleChange}
        maxLength={9}
      />
    </div>
  );
}
