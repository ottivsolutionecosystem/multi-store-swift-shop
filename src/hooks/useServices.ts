
import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { createServices } from '@/lib/services';

export function useServices() {
  const { storeId, loading } = useTenant();

  return useMemo(() => {
    console.log('🔧 useServices - Memo recalculating...');
    console.log('🔧 useServices - storeId:', storeId, 'loading:', loading);
    
    // Retorna null enquanto ainda está carregando
    if (loading) {
      console.log('🔧 useServices - Still loading, returning null');
      return null;
    }
    
    // Se não há storeId após carregar, retorna null
    if (!storeId) {
      console.log('🔧 useServices - No storeId available, returning null');
      return null;
    }
    
    console.log('🔧 useServices - Creating services for storeId:', storeId);
    const services = createServices(storeId);
    
    console.log('🔧 useServices - Services created successfully');
    return services;
  }, [storeId, loading]); // Removido o debug do profileService para evitar recriações
}
