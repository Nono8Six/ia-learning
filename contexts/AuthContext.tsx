"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthProviderProps, AuthState, UserProfile } from '@/lib/types/auth-types';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AppError, logError } from '@/error';

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session and set up auth state
    const initializeAuth = async () => {
      try {
        // Get session from Supabase auth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          const appError = new AppError('Error fetching session', error.code);
          logError(appError);
          return;
        }

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name,
              avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
            },
            session,
            isLoading: false,
          });
        } else {
          setAuthState({ user: null, session: null, isLoading: false });
        }
      } catch (error) {
        const appError = new AppError('Auth initialization error');
        logError(appError);
        setAuthState({ user: null, session: null, isLoading: false });
      }
    };

    // Run initialization
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name,
              avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
              updated_at: profile?.updated_at,
            },
            session,
            isLoading: false,
          });
        } else {
          setAuthState({ user: null, session: null, isLoading: false });
        }
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // Si signUp est réussi mais que la session n'est pas encore créée
      // (cela peut arriver si la confirmation d'email est requise)
      if (data?.user && !data?.session) {
        // Dans un environnement de développement, nous allons supposer que l'email est déjà vérifié
        // et nous allons permettre à l'utilisateur de se connecter immédiatement
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        });
        
        // Rediriger vers la page de connexion
        window.location.href = '/auth/signin';
      } else if (data?.session) {
        // Si la session est immédiatement créée (confirmation d'email désactivée), 
        // mettre à jour l'état d'authentification
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id || '')
          .single();

        setAuthState({
          user: {
            id: data.user?.id || '',
            email: data.user?.email || '',
            full_name: profile?.full_name || data.user?.user_metadata?.full_name,
            avatar_url: profile?.avatar_url || data.user?.user_metadata?.avatar_url,
            created_at: data.user?.created_at || '',
          },
          session: data.session,
          isLoading: false,
        });
        
        // Rediriger vers le tableau de bord
        window.location.href = '/dashboard';
      }

      return { data, error: null };
    } catch (error: any) {
      const appError = new AppError(error.message || 'Erreur lors de l\'inscription', error.code);
      logError(appError);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: appError.message,
      });
      return { data: null, error: appError };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message =
          error.message || (error as any).error_description || 'Erreur de connexion';
        const appError = new AppError(message, error.code);
        logError(appError);
        return { data: null, error: appError };
      }

      return { data, error: null };
    } catch (error: any) {
      const message =
        error.message || (error as any).error_description || 'Erreur de connexion';
      const appError = new AppError(message, error.code);
      logError(appError);
      return { data: null, error: appError };
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      const appError = new AppError(error.message || 'Erreur de connexion Google', error.code);
      logError(appError);
      toast({
        variant: "destructive",
        title: "Erreur de connexion Google",
        description: appError.message,
      });
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setAuthState({ user: null, session: null, isLoading: false });
    } catch (error: any) {
      const appError = new AppError(error.message || 'Erreur de déconnexion', error.code);
      logError(appError);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: appError.message,
      });
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      });

      return { data, error: null };
    } catch (error: any) {
      const appError = new AppError(error.message || "Erreur de réinitialisation", error.code);
      logError(appError);
      toast({
        variant: "destructive",
        title: "Erreur de réinitialisation",
        description: appError.message,
      });
      return { data: null, error: appError };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) {
        throw new Error("Utilisateur non connecté");
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: authState.user.id, 
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setAuthState({
        ...authState,
        user: { ...authState.user, ...updates }
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });

      return { data, error: null };
    } catch (error: any) {
      const appError = new AppError(error.message || "Erreur de mise à jour", error.code);
      logError(appError);
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: appError.message,
      });
      return { data: null, error: appError };
    }
  };

  // Update user password
  const updatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      });

      return { data, error: null };
    } catch (error: any) {
      const appError = new AppError(error.message || "Erreur de mise à jour", error.code);
      logError(appError);
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: appError.message,
      });
      return { data: null, error: appError };
    }
  };

  const value = {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new AppError('useAuth must be used within an AuthProvider');
  }
  return context;
};