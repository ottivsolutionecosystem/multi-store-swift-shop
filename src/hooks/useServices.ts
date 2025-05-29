
import { useMemo, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { createServices } from '@/lib/services';
import { testAuthState, forceAuthRefresh } from '@/lib/auth-utils';

export function useServices() {
  const { storeId, loading: tenantLoading } = useTenant();
  const { user, session, loading: authLoading } = useAuth();

  // Debug auth state when it changes
  useEffect(() => {
    if (!authLoading) {
      console.log('useServices - auth state changed:', {
        hasUser: !!user,
        hasSession: !!session,
        userId: user?.id,
        sessionValid: !!session?.access_token
      });

      // Run auth test when user is available
      if (user && session) {
        setTimeout(() => {
          testAuthState().then(result => {
            console.log('useServices - auth test result:', result);
            
            // If auth is failing, try to refresh
            if (!result.profileAccess && result.session && result.user) {
              console.log('useServices - auth issue detected, trying refresh...');
              forceAuthRefresh();
            }
          });
        }, 500);
      }
    }
  }, [user, session, authLoading]);

  return useMemo(() => {
    console.log('useServices - computing services:', {
      storeId,
      tenantLoading,
      authLoading,
      hasUser: !!user,
      hasSession: !!session
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
    
    console.log('useServices - creating services for storeId:', storeId);
    const services = createServices(storeId);
    
    // Debug user access when services are created
    if (services.profileService) {
      services.profileService.debugUserAccess().catch(console.error);
    }
    
    return services;
  }, [storeId, tenantLoading, authLoading, user, session]);
}
