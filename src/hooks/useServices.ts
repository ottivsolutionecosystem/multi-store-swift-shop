
import { useMemo, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { createServices } from '@/lib/services';
import { testAuthState, forceAuthRefresh, ensureAuthForOperation } from '@/lib/auth-utils';

export function useServices() {
  const { storeId, loading: tenantLoading } = useTenant();
  const { user, session, loading: authLoading } = useAuth();

  // Enhanced auth state monitoring
  useEffect(() => {
    if (!authLoading) {
      console.log('useServices - enhanced auth state changed:', {
        hasUser: !!user,
        hasSession: !!session,
        userId: user?.id,
        sessionValid: !!session?.access_token,
        sessionExpiresAt: session?.expires_at
      });

      // Run enhanced auth test when user is available
      if (user && session) {
        setTimeout(() => {
          testAuthState().then(result => {
            console.log('useServices - enhanced auth test result:', result);
            
            // If auth is failing, try comprehensive recovery
            if (!result.databaseConnection && result.session && result.user) {
              console.log('useServices - database connection issue detected, trying recovery...');
              ensureAuthForOperation('useServices-recovery').then(recovered => {
                console.log('useServices - recovery result:', recovered);
                if (!recovered) {
                  console.warn('useServices - auth recovery failed, user may need to re-authenticate');
                }
              });
            }
          });
        }, 500);
      }
    }
  }, [user, session, authLoading]);

  return useMemo(() => {
    console.log('useServices - computing enhanced services:', {
      storeId,
      tenantLoading,
      authLoading,
      hasUser: !!user,
      hasSession: !!session,
      sessionExpiresAt: session?.expires_at
    });
    
    // Wait for both tenant and auth to load
    if (tenantLoading || authLoading) {
      console.log('useServices - still loading');
      return null;
    }
    
    // If no storeId after loading, return null
    if (!storeId) {
      console.log('useServices - no storeId available');
      return null;
    }

    // If no user/session, return null
    if (!user || !session) {
      console.log('useServices - no authenticated user/session');
      return null;
    }

    // Check session validity
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at || 0;
    
    if (now >= expiresAt) {
      console.log('useServices - session expired, services not available');
      // Trigger refresh in background
      forceAuthRefresh().catch(console.error);
      return null;
    }
    
    console.log('useServices - creating enhanced services for storeId:', storeId);
    const services = createServices(storeId);
    
    return services;
  }, [storeId, tenantLoading, authLoading, user, session]);
}
