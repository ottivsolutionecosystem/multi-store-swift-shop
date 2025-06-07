
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { getSupabaseConfig } from '@/config';

const supabaseConfig = getSupabaseConfig();

// Factory function to create Supabase client for requests
export function createSupabaseClient() {
  return createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

// Singleton client for general use
export const supabaseClient = createSupabaseClient();
