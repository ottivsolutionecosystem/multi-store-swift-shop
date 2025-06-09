
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, Profile } from '@/types/auth';
import { SmartUserCache } from '@/lib/smartUserCache';

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data from cache
  useEffect(() => {
    console.log('AuthProvider - initializing with smart cache');
    
    const initializeAuth = async () => {
      try {
        // Check for existing session first
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Try to get cached profile
          const cachedProfile = await SmartUserCache.getProfile(currentSession.user.id);
          if (cachedProfile) {
            console.log('AuthProvider - loaded cached profile');
            setProfile(cachedProfile);
          } else {
            // Fetch profile from database and cache it
            console.log('AuthProvider - fetching profile from database');
            const { data: freshProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .maybeSingle();
            
            if (freshProfile) {
              setProfile(freshProfile);
              await SmartUserCache.setUserData(currentSession.user, freshProfile);
            }
          }
        }
      } catch (error) {
        console.error('AuthProvider - initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    console.log('AuthProvider - setting up optimized auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider - auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          console.log('AuthProvider - user signed out, clearing cache');
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('AuthProvider - user signed in, using smart cache');
          
          // Defer profile loading to prevent blocking auth flow
          setTimeout(async () => {
            try {
              // Try cache first
              const cachedProfile = await SmartUserCache.getProfile(session.user.id);
              if (cachedProfile) {
                console.log('AuthProvider - using cached profile');
                setProfile(cachedProfile);
                setLoading(false);
                return;
              }
              
              // Fetch fresh profile if not cached
              console.log('AuthProvider - fetching fresh profile');
              const { data: freshProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('AuthProvider - profile fetched:', freshProfile);
              setProfile(freshProfile);
              
              // Update cache with fresh data
              if (freshProfile) {
                await SmartUserCache.setUserData(session.user, freshProfile);
              }
            } catch (error) {
              console.error('AuthProvider - error loading profile:', error);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthProvider - cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthState = {
    user,
    session,
    profile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
