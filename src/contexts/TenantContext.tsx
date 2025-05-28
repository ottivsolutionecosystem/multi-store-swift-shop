
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
      try {
        const currentStore = await getCurrentStore();
        setStore(currentStore);
      } catch (error) {
        console.error('Error loading store:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  const value: TenantContextType = {
    store,
    storeId: store?.id || null,
    loading,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
