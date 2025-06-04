import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SignUpForm } from '@/components/auth/SignUpForm';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ signUp: vi.fn().mockResolvedValue({ data: {}, error: null }), signInWithGoogle: vi.fn() })
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('SignUpForm', () => {
  it('shows password mismatch error', async () => {
    render(<SignUpForm />);
    await userEvent.type(screen.getByLabelText(/nom complet/i), 'John');
    await userEvent.type(screen.getByLabelText(/^adresse email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^mot de passe$/i), 'Password1');
    await userEvent.type(screen.getByLabelText(/confirmer le mot de passe/i), 'Pass');
    await userEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
    expect(await screen.findByText(/ne correspondent pas/i)).toBeInTheDocument();
  });
});
