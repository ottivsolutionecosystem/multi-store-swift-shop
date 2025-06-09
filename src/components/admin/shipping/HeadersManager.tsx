
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface Header {
  name: string;
  value: string;
}

interface HeadersManagerProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}

export function HeadersManager({ headers, onChange }: HeadersManagerProps) {
  const [headerList, setHeaderList] = useState<Header[]>(
    Object.entries(headers).map(([name, value]) => ({ name, value }))
  );

  const addHeader = () => {
    const newHeaders = [...headerList, { name: '', value: '' }];
    setHeaderList(newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headerList.filter((_, i) => i !== index);
    setHeaderList(newHeaders);
    updateHeaders(newHeaders);
  };

  const updateHeader = (index: number, field: 'name' | 'value', value: string) => {
    const newHeaders = headerList.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    );
    setHeaderList(newHeaders);
    updateHeaders(newHeaders);
  };

  const updateHeaders = (headers: Header[]) => {
    const headersObject = headers.reduce((acc, header) => {
      if (header.name.trim() && header.value.trim()) {
        acc[header.name.trim()] = header.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
    
    onChange(headersObject);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Headers da API
          <Button type="button" onClick={addHeader} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Header
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {headerList.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum header configurado</p>
        ) : (
          headerList.map((header, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor={`header-name-${index}`} className="sr-only">
                  Nome do Header
                </Label>
                <Input
                  id={`header-name-${index}`}
                  placeholder="Nome (ex: Authorization)"
                  value={header.name}
                  onChange={(e) => updateHeader(index, 'name', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`header-value-${index}`} className="sr-only">
                  Valor do Header
                </Label>
                <Input
                  id={`header-value-${index}`}
                  placeholder="Valor (ex: Bearer token123)"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeHeader(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
