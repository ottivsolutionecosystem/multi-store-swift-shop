
import { supabase, AuthRecoveryUtils } from '@/integrations/supabase/client';

export async function testAuthState() {
  console.log('Testing enhanced auth state...');
  
  try {
    // First validate current session
    const sessionValid = await AuthRecoveryUtils.validateCurrentSession();
    console.log('Auth test - session validation:', sessionValid);

    // Test database connection
    const dbTest = await AuthRecoveryUtils.testDatabaseConnection();
    console.log('Auth test - database connection:', dbTest);

    // Get current session info
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Auth test - session info:', {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      expiresAt: session?.expires_at,
      error: sessionError
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Auth test - user info:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      error: userError
    });

    return {
      sessionValid,
      databaseConnection: dbTest.success,
      session: !!session,
      user: !!user,
      errors: {
        session: sessionError,
        user: userError,
        database: dbTest.error
      }
    };
  } catch (error) {
    console.error('Enhanced auth test failed:', error);
    return {
      sessionValid: false,
      databaseConnection: false,
      session: false,
      user: false,
      errors: { general: error }
    };
  }
}

export async function forceAuthRefresh() {
  console.log('Forcing enhanced auth refresh...');
  try {
    // First try token refresh
    const refreshSuccess = await AuthRecoveryUtils.forceTokenRefresh();
    if (refreshSuccess) {
      console.log('Auth refresh successful');
      return true;
    }

    // If refresh fails, try to get fresh session
    console.log('Token refresh failed, attempting session recovery...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log('No session found, user needs to re-authenticate');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Enhanced auth refresh failed:', error);
    return false;
  }
}

export async function recoverAuthState() {
  console.log('Starting auth state recovery...');
  
  try {
    // Step 1: Clean corrupted storage
    await AuthRecoveryUtils.cleanAuthStorage();
    
    // Step 2: Try to refresh session
    const refreshed = await AuthRecoveryUtils.forceTokenRefresh();
    if (refreshed) {
      console.log('Auth recovery successful via refresh');
      return { success: true, method: 'refresh' };
    }
    
    // Step 3: Check if user needs to re-authenticate
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      console.log('Auth recovery requires re-authentication');
      return { success: false, requiresReauth: true };
    }
    
    console.log('Auth recovery completed');
    return { success: true, method: 'session' };
  } catch (error) {
    console.error('Auth recovery failed:', error);
    return { success: false, error };
  }
}

// Enhanced auth verification for critical operations
export async function ensureAuthForOperation(operationName: string): Promise<boolean> {
  console.log(`Ensuring auth for operation: ${operationName}`);
  
  try {
    // Quick session check
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      console.log(`Auth check failed for ${operationName}: no session`);
      return false;
    }

    // Validate token expiry
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at || 0;
    
    if (now >= expiresAt - 60) { // Refresh if expires in next minute
      console.log(`Auth token near expiry for ${operationName}, refreshing...`);
      const refreshed = await AuthRecoveryUtils.forceTokenRefresh();
      if (!refreshed) {
        console.log(`Auth refresh failed for ${operationName}`);
        return false;
      }
    }

    // Test database access
    const dbTest = await AuthRecoveryUtils.testDatabaseConnection();
    if (!dbTest.success) {
      console.log(`Database access failed for ${operationName}:`, dbTest.error);
      
      // Try one recovery attempt
      const recovery = await recoverAuthState();
      if (!recovery.success) {
        return false;
      }
      
      // Re-test after recovery
      const retestDb = await AuthRecoveryUtils.testDatabaseConnection();
      return retestDb.success;
    }

    console.log(`Auth verified for operation: ${operationName}`);
    return true;
  } catch (error) {
    console.error(`Auth verification failed for ${operationName}:`, error);
    return false;
  }
}
