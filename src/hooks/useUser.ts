
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { Profile } from '@/types/auth';

export function useUser() {
  const { user, profile, loading } = useAuth();
  const services = useServices();
  const [refreshing, setRefreshing] = useState(false);

  const refreshProfile = async () => {
    if (!services?.userService || refreshing) return;
    
    console.log('useUser - refreshing profile data');
    setRefreshing(true);
    
    try {
      await services.userService.getCurrentUserProfile(true); // Force refresh
      console.log('useUser - profile refreshed successfully');
    } catch (error) {
      console.error('useUser - error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!services?.userService) {
      throw new Error('UserService not available');
    }
    
    console.log('useUser - updating profile');
    return services.userService.updateProfile(updates);
  };

  const clearCache = () => {
    if (services?.userService) {
      console.log('useUser - clearing user cache');
      services.userService.clearCache();
    }
  };

  return {
    user,
    profile,
    loading: loading || refreshing,
    refreshProfile,
    updateProfile,
    clearCache,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
  };
}
