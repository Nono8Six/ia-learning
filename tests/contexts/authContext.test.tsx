import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock supabase client
const mocks = {
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signIn: vi.fn(),
  from: vi.fn()
};

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...a: any[]) => mocks.getSession(...a),
      onAuthStateChange: (...a: any[]) => mocks.onAuthStateChange(...a),
      signInWithPassword: (...a: any[]) => mocks.signIn(...a)
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: (...a: any[]) => mocks.from(...a)
        })
      })
    })
  }
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

const session = {
  user: {
    id: '1',
    email: 'test@example.com',
    user_metadata: { full_name: 'Test User', avatar_url: null },
    created_at: 'today'
  }
};

beforeEach(() => {
  mocks.getSession.mockResolvedValue({ data: { session }, error: null });
  mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  mocks.from.mockResolvedValue({ data: { full_name: 'Test User', avatar_url: null } });
  mocks.signIn.mockResolvedValue({ data: { session }, error: null });
});

describe('AuthContext', () => {
  it('initializes user from session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('signIn calls supabase and returns result', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => !result.current.isLoading);
    await act(async () => {
      const { error } = await result.current.signIn('a@test.com', 'pass');
      expect(mocks.signIn).toHaveBeenCalled();
      expect(error).toBeNull();
    });
  });
});
