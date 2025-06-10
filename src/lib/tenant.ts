
import { supabase } from '@/integrations/supabase/client';

export async function getStoreByDomain(domain: string) {
  console.log('Getting store by domain:', domain);
  
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
      console.error('Error fetching store by domain:', error);
      throw error;
    }

    console.log('Store found:', store);
    return store;
  } catch (error) {
    console.error('Database error in getStoreByDomain:', error);
    throw error;
  }
}

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') {
    console.log('Server side - using default domain');
    return 'localhost:3000';
  }
  
  const domain = window.location.host;
  console.log('Current domain detected:', domain);
  return domain;
}

export async function getCurrentStore() {
  const domain = getCurrentDomain();
  console.log('Getting current store for domain:', domain);
  
  try {
    const store = await getStoreByDomain(domain);
    
    if (store) {
      console.log('Store found successfully:', store);
      return store;
    }
    
    // Se não encontrou a loja, criar uma loja demo
    console.warn('No store found for domain:', domain, '- creating demo store');
    
    const demoStore = {
      id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
      name: 'Demo Store',
      domain: domain,
      custom_domain: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      store_settings: null, // Demo sem configurações específicas
    };
    
    console.log('Using demo store:', demoStore);
    return demoStore;
    
  } catch (error) {
    console.error('Error getting current store:', error);
    
    // Fallback para demo store em caso de erro
    const fallbackStore = {
      id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
      name: 'Demo Store (Fallback)',
      domain: domain,
      custom_domain: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      store_settings: null,
    };
    
    console.log('Using fallback store due to error:', fallbackStore);
    return fallbackStore;
  }
}
