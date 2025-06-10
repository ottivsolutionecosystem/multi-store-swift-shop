
import React, { createContext, useContext, useEffect, useState } from 'react';
import { TenantContext as TenantContextType, Store } from '@/types/tenant';
import { getCurrentStore } from '@/lib/tenant';

const TenantContext = createContext<TenantContextType>({
  store: null,
  storeId: null,
  loading: true,
});

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStore = async () => {
      console.log('TenantProvider - Starting to load store...');
      
      try {
        setLoading(true);
        const currentStore = await getCurrentStore();
        
        if (currentStore) {
          console.log('TenantProvider - Store loaded successfully:', currentStore);
          setStore(currentStore);
        } else {
          console.error('TenantProvider - No store returned from getCurrentStore');
        }
      } catch (error) {
        console.error('TenantProvider - Error loading store:', error);
        
        // Em caso de erro, ainda assim criar uma store fallback
        const errorFallbackStore: Store = {
          id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
          name: 'Demo Store (Error Fallback)',
          domain: window.location?.host || 'unknown',
          custom_domain: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log('TenantProvider - Using error fallback store:', errorFallbackStore);
        setStore(errorFallbackStore);
      } finally {
        setLoading(false);
        console.log('TenantProvider - Loading completed');
      }
    };

    loadStore();
  }, []);

  const value: TenantContextType = {
    store,
    storeId: store?.id || null,
    loading,
  };

  console.log('TenantProvider - Current context value:', value);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
