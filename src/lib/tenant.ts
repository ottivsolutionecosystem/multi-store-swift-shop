
import { supabase } from '@/integrations/supabase/client';

export async function getStoreByDomain(domain: string) {
  console.log('🏪 Getting store by domain:', domain);
  
  try {
    const { data: store, error } = await supabase
      .from('stores')
      .select(`
        *,
        store_settings:store_settings(*)
      `)
      .or(`domain.eq.${domain},custom_domain.eq.${domain}`)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching store by domain:', error);
      throw error;
    }

    if (store) {
      console.log('✅ Store found with settings:', {
        store: store.name,
        hasSettings: !!store.store_settings,
        settingsData: store.store_settings
      });
    } else {
      console.log('⚠️ No store found for domain:', domain);
    }

    return store;
  } catch (error) {
    console.error('💥 Database error in getStoreByDomain:', error);
    throw error;
  }
}

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') {
    console.log('🖥️ Server side - using default domain');
    return 'localhost:3000';
  }
  
  const domain = window.location.host;
  console.log('🌐 Current domain detected:', domain);
  return domain;
}

export async function getCurrentStore() {
  const domain = getCurrentDomain();
  console.log('🔍 Getting current store for domain:', domain);
  
  try {
    const store = await getStoreByDomain(domain);
    
    if (store) {
      console.log('🎉 Store loaded successfully:', {
        name: store.name,
        hasSettings: !!store.store_settings,
        settingsCount: store.store_settings ? Object.keys(store.store_settings).length : 0
      });
      return store;
    }
    
    // Se não encontrou a loja, criar uma loja demo com configurações padrão completas
    console.warn('🚧 No store found for domain:', domain, '- creating demo store with default settings');
    
    const demoStore = {
      id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
      name: 'Demo Store',
      domain: domain,
      custom_domain: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      store_settings: {
        id: 'demo-settings',
        store_id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
        primary_color: '#3b82f6',
        secondary_color: '#6b7280',
        price_color: '#16a34a',
        logo_url: '',
        banner_url: '',
        store_description: 'Loja demonstrativa com configurações padrão',
        show_category: true,
        show_description: true,
        show_stock_quantity: true,
        show_price: true,
        show_promotion_badge: true,
        promotion_display_format: 'percentage' as const,
        contact_info: {},
        shipping_settings: {},
        payment_settings: {},
        free_shipping_enabled: false,
        free_shipping_threshold: 0,
        free_shipping_message: 'Frete grátis em compras acima de R$ {threshold}',
        origin_address: {},
        stripe_user_id: null,
        stripe_connected: false,
        stripe_connect_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    };
    
    console.log('🎨 Using demo store with default settings:', demoStore);
    return demoStore;
    
  } catch (error) {
    console.error('❌ Error getting current store:', error);
    
    // Fallback para demo store com configurações padrão completas em caso de erro
    const fallbackStore = {
      id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
      name: 'Demo Store (Fallback)',
      domain: domain,
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
        promotion_display_format: 'percentage' as const,
        contact_info: {},
        shipping_settings: {},
        payment_settings: {},
        free_shipping_enabled: false,
        free_shipping_threshold: 0,
        free_shipping_message: 'Frete grátis em compras acima de R$ {threshold}',
        origin_address: {},
        stripe_user_id: null,
        stripe_connected: false,
        stripe_connect_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    };
    
    console.log('🆘 Using fallback store with default settings due to error:', fallbackStore);
    return fallbackStore;
  }
}
