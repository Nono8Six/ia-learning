import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SignInForm } from '@/components/auth/SignInForm';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ signIn: vi.fn().mockResolvedValue({ data: {}, error: null }), signInWithGoogle: vi.fn() })
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('SignInForm', () => {
  it('displays validation errors', async () => {
    render(<SignInForm />);
    const submit = screen.getByRole('button', { name: /se connecter/i });
    await userEvent.click(submit);
    expect(await screen.findAllByText(/doit contenir/i)).toBeTruthy();
  });
});
