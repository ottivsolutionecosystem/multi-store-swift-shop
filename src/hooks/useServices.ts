
import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { createServices } from '@/lib/services';

export function useServices() {
  const { storeId, loading } = useTenant();

  return useMemo(() => {
    console.log('useServices - storeId:', storeId, 'loading:', loading);
    
    // Retorna null enquanto ainda está carregando
    if (loading) {
      console.log('useServices - still loading');
      return null;
    }
    
    // Se não há storeId após carregar, retorna null
    if (!storeId) {
      console.log('useServices - no storeId available');
      return null;
    }
    
    console.log('useServices - creating services for storeId:', storeId);
    const services = createServices(storeId);
    
    // Debug user access when services are created
    if (services.profileService) {
      services.profileService.debugUserAccess().catch(console.error);
    }
    
    return services;
  }, [storeId, loading]);
}
