
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  bucket: 'product-images' | 'category-images' | 'user-avatars';
  folder?: string;
  value?: string;
  onChange: (url: string | null) => void;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUpload({
  bucket,
  folder,
  value,
  onChange,
  className = '',
  multiple = false,
  maxFiles = 5
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, uploading } = useImageUpload({ bucket, folder });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Criar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload do arquivo
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      onChange(imageUrl);
    }
  };

  const handleRemove = async () => {
    if (value) {
      const success = await deleteImage(value);
      if (success) {
        setPreview(null);
        onChange(null);
      }
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        multiple={multiple}
      />

      {preview ? (
        <Card className="relative p-4">
          <div className="relative aspect-square w-full max-w-sm mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card 
          className="border-dashed border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition-colors p-8"
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <ImageIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                Clique para enviar uma imagem
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP até 5MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="mt-4"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
