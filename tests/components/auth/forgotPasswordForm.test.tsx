import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ resetPassword: vi.fn().mockResolvedValue({ data: {}, error: null }) })
}));

describe('ForgotPasswordForm', () => {
  it('requires email', async () => {
    render(<ForgotPasswordForm />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/adresse email invalide/i)).toBeInTheDocument();
  });
});
