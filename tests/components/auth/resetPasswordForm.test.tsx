import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

vi.mock('@/lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: {} }, error: null }), updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }) } }
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('ResetPasswordForm', () => {
  it('validates password rules', async () => {
    render(<ResetPasswordForm />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findAllByText(/doit contenir/i).then(l=>l.length>0)).toBe(true);
  });
});
