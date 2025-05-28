
import { supabase } from '@/integrations/supabase/client';

export async function getStoreByDomain(domain: string) {
  console.log('Getting store by domain:', domain);
  
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .or(`domain.eq.${domain},custom_domain.eq.${domain}`)
    .maybeSingle();

  if (error) {
    console.error('Error fetching store by domain:', error);
    throw error;
  }

  console.log('Store found:', store);
  return store;
}

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return 'localhost:3000';
  return window.location.host;
}

export async function getCurrentStore() {
  const domain = getCurrentDomain();
  console.log('Getting current store for domain:', domain);
  
  try {
    const store = await getStoreByDomain(domain);
    return store;
  } catch (error) {
    console.error('Error getting current store:', error);
    // For development, return the demo store if domain lookup fails
    if (domain.includes('localhost')) {
      console.log('Using fallback store for localhost');
      return {
        id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87',
        name: 'Demo Store',
        domain: 'localhost:3000',
        custom_domain: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
}
