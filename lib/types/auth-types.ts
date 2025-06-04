import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthState = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
};

import { AppError } from '@/error';

export type AuthContextType = AuthState & {
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any | null; error: AppError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any | null; error: AppError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any | null; error: AppError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: any | null; error: AppError | null }>;
  updatePassword: (password: string) => Promise<{ data: any | null; error: AppError | null }>;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};