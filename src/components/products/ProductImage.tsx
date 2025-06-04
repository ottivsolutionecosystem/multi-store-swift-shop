
import React from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  imageUrl?: string | null;
  name: string;
}

export function ProductImage({ imageUrl, name }: ProductImageProps) {
  return (
    <div className="aspect-square relative overflow-hidden rounded-t-lg">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
  );
}
