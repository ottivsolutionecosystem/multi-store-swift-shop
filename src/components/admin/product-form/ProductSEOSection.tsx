
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProductSEOSectionProps {
  seoTitle: string;
  seoDescription: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
}

export function ProductSEOSection({
  seoTitle,
  seoDescription,
  onSeoTitleChange,
  onSeoDescriptionChange
}: ProductSEOSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Otimização para Mecanismos de Busca (SEO)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="seo_title">Título SEO</Label>
          <Input
            id="seo_title"
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            placeholder="Título otimizado para SEO"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoTitle.length}/60 caracteres
          </p>
        </div>

        <div>
          <Label htmlFor="seo_description">Descrição SEO</Label>
          <Textarea
            id="seo_description"
            value={seoDescription}
            onChange={(e) => onSeoDescriptionChange(e.target.value)}
            placeholder="Descrição otimizada para SEO"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoDescription.length}/160 caracteres
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
