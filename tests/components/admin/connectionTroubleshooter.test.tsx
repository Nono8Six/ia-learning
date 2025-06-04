import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ConnectionTroubleshooter } from '@/components/admin/connection-troubleshooter';

vi.mock('@/contexts/AdminContext', () => ({ useAdmin: () => ({ loadCourses: vi.fn(), loadUsers: vi.fn(), loadCoupons: vi.fn() }) }));
vi.mock('@/lib/supabase', () => ({ supabase: { auth: { getSession: vi.fn() }, from: vi.fn() } }));

describe('ConnectionTroubleshooter', () => {
  it('toggles key input', async () => {
    render(<ConnectionTroubleshooter />);
    const btn = screen.getByRole('button', { name: /modifier la clé/i });
    await userEvent.click(btn);
    expect(screen.getByLabelText(/clé anon/i)).toBeInTheDocument();
  });
});
