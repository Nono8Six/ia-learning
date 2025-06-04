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

export type AuthContextType = AuthState & {
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any | null; error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any | null; error: any | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any | null; error: any | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: any | null; error: any | null }>;
  updatePassword: (password: string) => Promise<{ data: any | null; error: any | null }>;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};