
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://dkliovgbxuskqmnfojvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGlvdmdieHVza3FtbmZvanZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcyMDgsImV4cCI6MjA2Mzk5MzIwOH0.w1EKr-ae-jK6_WRKMuvbZ2tbfJ0qaPeyh4uJ2eF2BBw";

// Factory function to create Supabase client for requests
export function createSupabaseClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

// Singleton client for general use
export const supabaseClient = createSupabaseClient();
