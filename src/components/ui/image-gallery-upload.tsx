
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, Plus } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageGalleryUploadProps {
  bucket: 'product-images' | 'category-images';
  folder?: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageGalleryUpload({
  bucket,
  folder,
  value = [],
  onChange,
  maxImages = 5,
  className = ''
}: ImageGalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { uploadImage, deleteImage } = useImageUpload({ bucket, folder });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length && value.length + newUrls.length < maxImages; i++) {
      const imageUrl = await uploadImage(files[i]);
      if (imageUrl) {
        newUrls.push(imageUrl);
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }
    
    setUploading(false);
    
    // Limpar input
    event.target.value = '';
  };

  const handleRemove = async (index: number) => {
    const imageUrl = value[index];
    const success = await deleteImage(imageUrl);
    
    if (success) {
      const newUrls = value.filter((_, i) => i !== index);
      onChange(newUrls);
    }
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((imageUrl, index) => (
          <Card key={index} className="relative p-2">
            <div className="aspect-square relative">
              <img
                src={imageUrl}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
        
        {canAddMore && (
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition-colors">
            <label className="aspect-square flex flex-col items-center justify-center cursor-pointer p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Plus className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-xs text-gray-500 text-center">
                  {uploading ? 'Enviando...' : 'Adicionar'}
                </span>
              </div>
            </label>
          </Card>
        )}
      </div>
      
      {value.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 p-8">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Nenhuma imagem adicionada
            </p>
            <p className="text-sm text-gray-500">
              Máximo de {maxImages} imagens
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
