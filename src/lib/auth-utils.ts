
import { supabase } from '@/integrations/supabase/client';

export async function testAuthState() {
  console.log('Testing auth state...');
  
  try {
    // Test 1: Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Auth test - session:', {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      error: sessionError
    });

    // Test 2: Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Auth test - user:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      error: userError
    });

    // Test 3: Try to access a protected table
    const { data: profileTest, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, store_id')
      .limit(1);
    
    console.log('Auth test - profile access:', {
      data: profileTest,
      error: profileError
    });

    return {
      session: !!session,
      user: !!user,
      profileAccess: !profileError,
      errors: {
        session: sessionError,
        user: userError,
        profile: profileError
      }
    };
  } catch (error) {
    console.error('Auth test failed:', error);
    return {
      session: false,
      user: false,
      profileAccess: false,
      errors: { general: error }
    };
  }
}

export async function forceAuthRefresh() {
  console.log('Forcing auth refresh...');
  try {
    const { data, error } = await supabase.auth.refreshSession();
    console.log('Auth refresh result:', { data: !!data, error });
    return !error;
  } catch (error) {
    console.error('Auth refresh failed:', error);
    return false;
  }
}
