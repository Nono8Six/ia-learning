import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserManagement } from '@/components/admin/user-management';

const users = [
  { id: '1', email: 'john@example.com', full_name: 'John', role: 'student', created_at: '2020-01-01' }
];

vi.mock('@/contexts/AdminContext', () => ({
  useAdmin: () => ({ users, loadUsers: vi.fn(), updateUserRole: vi.fn(), isLoading: false })
}));

describe('UserManagement', () => {
  it('filters users', async () => {
    render(<UserManagement />);
    expect(screen.getByText('John')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText(/rechercher/i), 'zzz');
    expect(await screen.findByText(/aucun utilisateur/i)).toBeInTheDocument();
  });
});
