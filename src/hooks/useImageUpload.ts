
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

interface UseImageUploadProps {
  bucket: 'product-images' | 'category-images' | 'user-avatars';
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useImageUpload({
  bucket,
  folder,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: UseImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { storeId } = useTenant();
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) {
      toast({
        title: 'Erro',
        description: 'Nenhum arquivo selecionado',
        variant: 'destructive',
      });
      return null;
    }

    // Validar tipo de arquivo
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Erro',
        description: 'Tipo de arquivo não permitido',
        variant: 'destructive',
      });
      return null;
    }

    // Validar tamanho do arquivo
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: `Arquivo muito grande. Máximo ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      let filePath: string;
      if (bucket === 'user-avatars') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        filePath = `${user.id}/${fileName}`;
      } else {
        if (!storeId) throw new Error('Store ID not found');
        const folderPath = folder || 'general';
        filePath = `${storeId}/${folderPath}/${fileName}`;
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast({
        title: 'Sucesso',
        description: 'Imagem enviada com sucesso',
      });

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar imagem',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === bucket);
      if (bucketIndex === -1) throw new Error('Invalid image URL');
      
      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Imagem removida com sucesso',
      });

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover imagem',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
}
