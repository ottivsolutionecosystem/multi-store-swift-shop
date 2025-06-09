
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { useServices } from '@/hooks/useServices';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const services = useServices();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthContext - Initial session:', session);
        
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('AuthContext - Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext - Auth state changed:', event, session);
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [services]);

  const loadUserProfile = async (userId: string) => {
    try {
      if (!services?.userService) {
        console.log('AuthContext - UserService not available yet');
        return;
      }

      console.log('AuthContext - Loading profile for user:', userId);
      const userProfile = await services.userService.getCurrentUserProfile();
      console.log('AuthContext - Loaded profile:', userProfile);
      setProfile(userProfile);
    } catch (error) {
      console.error('AuthContext - Error loading user profile:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext - Signing in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('AuthContext - Sign in error:', error);
      throw error;
    }

    console.log('AuthContext - Sign in successful:', data);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('AuthContext - Signing up user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('AuthContext - Sign up error:', error);
      throw error;
    }

    console.log('AuthContext - Sign up successful:', data);
  };

  const signOut = async () => {
    console.log('AuthContext - Signing out');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('AuthContext - Sign out error:', error);
      throw error;
    }

    setUser(null);
    setProfile(null);
    console.log('AuthContext - Sign out successful');
  };

  const value: AuthState = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
