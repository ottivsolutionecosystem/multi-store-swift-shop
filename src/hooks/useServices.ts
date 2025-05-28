
import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { createServices } from '@/lib/services';

export function useServices() {
  const { storeId } = useTenant();

  return useMemo(() => {
    if (!storeId) {
      throw new Error('Store ID is required to create services');
    }
    return createServices(storeId);
  }, [storeId]);
}
