import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';

var mockRpc = vi.fn();
var mockFrom = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: '1' } }) }));

vi.mock('@/lib/supabase', () => ({
  connectionStatus: { online: true },
  supabase: {
    rpc: (...a: any[]) => mockRpc(...a),
    from: () => ({ select: (...a: any[]) => mockFrom(...a) })
  }
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminProvider>{children}</AdminProvider>
);

beforeEach(() => {
  mockRpc.mockResolvedValue({ data: true, error: null });
  mockFrom.mockResolvedValue({ data: [], error: null });
});

describe('AdminContext', () => {
  it('sets isAdmin when rpc returns true', async () => {
    const { result } = renderHook(() => useAdmin(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAdmin).toBe(true);
  });
});
