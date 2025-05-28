
import { supabase } from '@/integrations/supabase/client';

export function getImageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

export function extractImagePath(imageUrl: string, bucket: string): string | null {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === bucket);
    
    if (bucketIndex === -1) return null;
    
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}

export function generateImagePath(
  storeId: string, 
  folder: string, 
  fileName: string
): string {
  return `${storeId}/${folder}/${fileName}`;
}

export function generateUserImagePath(
  userId: string, 
  fileName: string
): string {
  return `${userId}/${fileName}`;
}

export function resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem redimensionada
      ctx?.drawImage(img, 0, 0, width, height);

      // Converter para blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function validateImageFile(file: File, maxSizeMB: number = 5): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Tipo de arquivo não suportado. Use JPG, PNG ou WEBP.';
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Arquivo muito grande. Máximo ${maxSizeMB}MB.`;
  }
  
  return null;
}
