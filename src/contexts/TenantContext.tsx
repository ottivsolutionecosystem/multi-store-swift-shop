
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
        console.log('Loading store for tenant...');
        const currentStore = await getCurrentStore();
        console.log('Store loaded:', currentStore);
        setStore(currentStore);
      } catch (error) {
        console.error('Error loading store:', error);
        // Para desenvolvimento, vamos criar uma store padrão se não encontrar
        if (!store) {
          console.log('Creating fallback store for development');
          const fallbackStore: Store = {
            id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87', // ID da store do profile
            name: 'Demo Store',
            domain: window.location.host,
            custom_domain: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setStore(fallbackStore);
        }
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

  console.log('TenantContext value:', value);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
