
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, Profile } from '@/types/auth';
import { UserCache } from '@/lib/userCache';

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
    console.log('AuthProvider - loading initial data from cache');
    const cached = UserCache.get();
    if (cached) {
      console.log('AuthProvider - found cached data');
      setUser(cached.user);
      setProfile(cached.profile);
    }
  }, []);

  useEffect(() => {
    console.log('AuthProvider - setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider - auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          console.log('AuthProvider - user signed out, clearing cache');
          UserCache.clear();
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('AuthProvider - user signed in, checking cache');
          
          // Check if we have valid cached profile
          const cached = UserCache.get();
          if (cached && cached.profile && cached.user?.id === session.user.id) {
            console.log('AuthProvider - using cached profile');
            setProfile(cached.profile);
            setLoading(false);
            return;
          }
          
          // Fetch profile if not cached
          setTimeout(async () => {
            console.log('AuthProvider - fetching profile from database');
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('AuthProvider - profile fetched:', profile);
              setProfile(profile);
              
              // Update cache with fresh data
              UserCache.set(session.user, profile);
            } catch (error) {
              console.error('AuthProvider - error fetching profile:', error);
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

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider - checking existing session');
      if (!session) {
        setLoading(false);
      }
    });

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
