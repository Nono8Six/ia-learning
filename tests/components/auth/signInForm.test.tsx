import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignInForm } from '@/components/auth/SignInForm';

const signInMock = vi.fn().mockResolvedValue({ data: {}, error: null });
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ signIn: signInMock, signInWithGoogle: vi.fn() })
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('SignInForm', () => {
  beforeEach(() => {
    signInMock.mockResolvedValue({ data: {}, error: null });
  });
  it('displays validation errors', async () => {
    render(<SignInForm />);
    const submit = screen.getByRole('button', { name: /se connecter/i });
    await userEvent.click(submit);
    expect(await screen.findAllByText(/doit contenir/i)).toBeTruthy();
  });

  it('shows credential error from api', async () => {
    signInMock.mockResolvedValueOnce({
      data: null,
      error: { code: 'invalid_login_credentials', message: 'Invalid login credentials' }
    });

    render(<SignInForm />);
    await userEvent.type(screen.getByLabelText(/^adresse email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^mot de passe$/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/adresse email ou mot de passe incorrect/i)).toBeInTheDocument();
  });
});
