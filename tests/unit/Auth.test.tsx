import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../src/app/providers/AppProvider';
import { useAuth } from '../../src/features/auth/context/AuthContext';
import { PhotographerLoginForm } from '../../src/features/auth/components/PhotographerLoginForm';

const AuthConsumerTest = () => {
  const { isConfigured, isAuthenticated, isAdmin, isProfileLoading, profileError, user, signOut } = useAuth();
  return (
    <div>
      <span data-testid="is-configured">{String(isConfigured)}</span>
      <span data-testid="is-authenticated">{String(isAuthenticated)}</span>
      <span data-testid="is-admin">{String(isAdmin)}</span>
      <span data-testid="is-profile-loading">{String(isProfileLoading)}</span>
      <span data-testid="profile-error">{profileError || 'none'}</span>
      <span data-testid="user-email">{user?.email || 'none'}</span>
      <button onClick={() => signOut()}>Trigger Sign Out</button>
    </div>
  );
};

describe('Auth Context and Photographer Login Primitives', () => {
  it('initializes auth state with correct unconfigured defaults when no .env is present', () => {
    render(
      <AppProvider>
        <AuthConsumerTest />
      </AppProvider>
    );

    expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    expect(screen.getByTestId('is-admin').textContent).toBe('false');
    expect(screen.getByTestId('is-profile-loading').textContent).toBe('false');
    expect(screen.getByTestId('profile-error').textContent).toBe('none');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('renders PhotographerLoginForm with accessible headings, inputs, and honest backend notice', () => {
    render(
      <AppProvider>
        <PhotographerLoginForm />
      </AppProvider>
    );

    expect(screen.getByRole('heading', { name: /photographer portal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /configuration required in \.env|sign in as photographer/i })).toBeInTheDocument();
  });

  it('safely handles sign-out without crashing and resets local auth state', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <AuthConsumerTest />
      </AppProvider>
    );

    const signOutBtn = screen.getByRole('button', { name: /trigger sign out/i });
    await user.click(signOutBtn);

    expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
  });
});
