
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string, captchaToken?: string) => Promise<{ error: any }>;
  register: (data: { name: string; email: string; password: string; company?: string; epaLicense?: string }, captchaToken?: string) => Promise<{ error: any; needsEmailConfirmation?: boolean; email?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Fetch user role from user_roles table (secure role storage)
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
      }

      if (profileData) {
        // Use role from user_roles table, fallback to 'user' if not found
        const userRole = roleData?.role || 'user';
        
        const profile = {
          id: profileData.id,
          email: profileData.email || '',
          full_name: profileData.full_name || '',
          role: userRole as 'admin' | 'user'
        };
        console.log('Profile fetched successfully with role from user_roles:', profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Initial session:', initialSession?.user?.id || 'no session');
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            const profileData = await fetchProfile(initialSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id || 'no session');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile without blocking the auth state
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        // Set loading to false immediately after handling auth state
        setIsLoading(false);
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, captchaToken?: string) => {
    console.log('AuthContext login attempt for:', email);
    try {
      // Build auth options with optional captcha token
      const authOptions: { email: string; password: string; options?: { captchaToken: string } } = {
        email: email.toLowerCase().trim(),
        password,
      };
      
      // Only include captchaToken if provided and non-empty
      if (captchaToken) {
        authOptions.options = { captchaToken };
      }
      
      const { error } = await supabase.auth.signInWithPassword(authOptions);
      
      console.log('Login response error:', error);
      return { error };
    } catch (error) {
      console.error('Login catch error:', error);
      return { error };
    }
  };

  const register = async (data: { name: string; email: string; password: string; company?: string; epaLicense?: string }, captchaToken?: string) => {
    try {
      console.log('Starting registration for:', data.email);
      
      // Build signup options
      const signupOptions: any = {
        data: {
          full_name: data.name,
          company: data.company,
          epa_license: data.epaLicense,
        },
        emailRedirectTo: `${window.location.origin}/`,
      };
      
      // Only include captchaToken if provided and non-empty
      if (captchaToken) {
        signupOptions.captchaToken = captchaToken;
      }
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: signupOptions,
      });
      
      if (error) {
        console.error('Registration error details:', error);
        
        // Provide specific error messages based on error type
        let errorMessage = error.message;
        
        if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Registration is currently disabled. Please contact support.';
        }
        
        return { 
          error: {
            message: errorMessage,
            status: error.status,
            statusText: error.status ? `${error.status}` : 'Registration failed'
          }
        };
      }
      
      // Check for duplicate email (Supabase returns 200 with empty identities for existing users)
      if (authData.user && (!authData.user.identities || authData.user.identities.length === 0)) {
        console.log('Duplicate email detected - empty identities array');
        return {
          error: {
            message: 'DUPLICATE_EMAIL',
            isDuplicate: true
          }
        };
      }
      
      // Check if email confirmation is required
      const needsEmailConfirmation = authData.user && !authData.user.email_confirmed_at;
      
      if (authData.user) {
        console.log('Registration successful, user created:', authData.user.id);
        console.log('Email confirmed:', !!authData.user.email_confirmed_at);
        console.log('Needs email confirmation:', needsEmailConfirmation);
        
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to verify the profile was created (non-blocking check)
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();
          
          if (profileData) {
            console.log('Profile created successfully:', profileData);
          } else {
            console.log('Profile not yet created (trigger may still be processing)');
          }
        } catch (profileCheckError) {
          // Silently ignore profile check errors - the trigger will handle creation
          console.log('Profile check skipped');
        }
        
        // If email confirmation is required, return a special status
        if (needsEmailConfirmation) {
          return { 
            error: null, 
            needsEmailConfirmation: true,
            email: data.email
          };
        }
      }
      
      return { error: null, needsEmailConfirmation: false };
    } catch (err: any) {
      console.error('Unexpected registration error:', err);
      return { 
        error: {
          message: err.message || 'An unexpected error occurred during registration',
          details: err
        }
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    session,
    profile,
    isAdmin,
    isLoading,
    signOut,
    login,
    register,
    logout,
  };

  console.log('AuthProvider render:', { 
    user: !!user, 
    profile: !!profile, 
    isAdmin, 
    isLoading,
    profileRole: profile?.role 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This can happen during hot-module-reload or if the provider isn't mounted yet
    // Return a safe default instead of throwing to prevent app crashes during development
    console.warn('useAuth called outside of AuthProvider - returning safe defaults');
    return {
      user: null,
      session: null,
      profile: null,
      isAdmin: false,
      isLoading: true,
      signOut: async () => {},
      login: async () => ({ error: { message: 'Auth not initialized' } }),
      register: async () => ({ error: { message: 'Auth not initialized' }, needsEmailConfirmation: false }),
      logout: async () => {},
    } as AuthContextType;
  }
  return context;
};
