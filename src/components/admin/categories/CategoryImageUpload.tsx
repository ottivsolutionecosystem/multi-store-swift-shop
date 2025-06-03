
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';

interface CategoryImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export function CategoryImageUpload({ imageUrl, onImageChange }: CategoryImageUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagem da Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          bucket="category-images"
          folder="categories"
          value={imageUrl}
          onChange={(url) => onImageChange(url || '')}
        />
      </CardContent>
    </Card>
  );
}
