
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
        
        // Em caso de erro, ainda assim criar uma store fallback com todas as propriedades obrigatórias
        const errorFallbackStore: Store = {
          id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
          name: 'Demo Store (Error Fallback)',
          domain: typeof window !== 'undefined' ? window.location?.host : 'unknown',
          custom_domain: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          store_settings: {
            id: 'fallback-settings',
            store_id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
            primary_color: '#3b82f6',
            secondary_color: '#6b7280',
            price_color: '#16a34a',
            logo_url: '',
            banner_url: '',
            store_description: 'Loja demonstrativa (modo de erro)',
            show_category: true,
            show_description: true,
            show_stock_quantity: true,
            show_price: true,
            show_promotion_badge: true,
            promotion_display_format: 'percentage',
            contact_info: {},
            shipping_settings: {},
            payment_settings: {},
            free_shipping_enabled: false,
            free_shipping_threshold: 0,
            free_shipping_message: 'Frete grátis em compras acima de R$ {threshold}',
            origin_address: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
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
