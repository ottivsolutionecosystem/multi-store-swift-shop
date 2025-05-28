
import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { createServices } from '@/lib/services';

export function useServices() {
  const { storeId, loading } = useTenant();

  return useMemo(() => {
    // Retorna null enquanto ainda está carregando ou se não há storeId
    if (loading || !storeId) {
      return null;
    }
    return createServices(storeId);
  }, [storeId, loading]);
}
