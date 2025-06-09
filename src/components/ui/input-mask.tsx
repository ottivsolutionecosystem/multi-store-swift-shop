
import React from 'react';
import { Input } from '@/components/ui/input';

interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: 'cep' | 'phone';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputMask({ mask, value, onChange, ...props }: InputMaskProps) {
  const formatValue = (inputValue: string, maskType: string) => {
    // Remove all non-numeric characters
    const cleaned = inputValue.replace(/\D/g, '');
    
    switch (maskType) {
      case 'cep':
        if (cleaned.length <= 5) {
          return cleaned;
        } else {
          return cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
        }
      case 'phone':
        if (cleaned.length <= 2) {
          return cleaned;
        } else if (cleaned.length <= 7) {
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length <= 11) {
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else {
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
      default:
        return inputValue;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value, mask);
    e.target.value = formattedValue;
    onChange(e);
  };

  return <Input {...props} value={value} onChange={handleChange} />;
}
