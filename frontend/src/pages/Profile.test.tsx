import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Profile from './Profile';
import { authService } from '../services/auth.service';
import { mockUsers } from '../tests/fixtures';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));
import api from '../services/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderProfile = () => {
  const router = createMemoryRouter(
    [{ path: '/profile', element: <Profile /> }],
    { initialEntries: ['/profile'] },
  );
  return render(<RouterProvider router={router} />);
};

describe('Test ===> Profile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should mount', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({
      data: mockUsers.regular,
    });

    renderProfile();
    await waitFor(() => {
      screen.getByText('My Profile');
      screen.getByText('User');
      screen.getByText('First Name');
      screen.getByText('Last Name');
      screen.getByText('Email');
      screen.getByText('Account Type');
      screen.getByText('Member Since');
      screen.getByText('Back to Sessions');
      screen.getByText('Delete Account');
    });
  });

  it('should fetch user info', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...mockUsers.regular,
        userRole: 'user',
        createdAt: new Date('2026-02-15'),
      },
    });

    renderProfile();
    await waitFor(() => {
      screen.getByText('John');
      screen.getByText('Doe');
      screen.getByText('user@test.com');
      screen.getByText('User');
      screen.getByText('February 15, 2026');
    });
  });

  it('should display loading', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    renderProfile();
    await waitFor(() => {
      screen.getByText('Loading profile...');
    });
  });

  it('should display error if api.get fails', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockRejectedValue(new Error('Internal server error'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderProfile();
    await waitFor(() => {
      screen.getByText('Failed to load user information');
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('should show Promote to Admin button if dev', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({
      data: mockUsers.regular,
    });

    renderProfile();
    await waitFor(() => {
      screen.getByText('Promote to Admin (Dev)');
    });
  });

  it('should Promote Account to admin', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers.regular });
    vi.mocked(api.post).mockResolvedValue({
      data: { ...mockUsers.regular, admin: true },
    });

    renderProfile();

    await waitFor(() => screen.getByText('Promote to Admin (Dev)'));

    fireEvent.click(screen.getByText('Promote to Admin (Dev)'));

    await waitFor(() => {
      screen.getByText('Administrator');
      expect(
        screen.queryByText('Promote to Admin (Dev)'),
      ).not.toBeInTheDocument();
    });
  });

  it('should display error if cannot promote Account', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers.regular });
    vi.mocked(api.post).mockRejectedValue(
      new Error('Admin self-promotion is only available in development'),
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderProfile();

    await waitFor(() => screen.getByText('Promote to Admin (Dev)'));

    fireEvent.click(screen.getByText('Promote to Admin (Dev)'));

    await waitFor(() => {
      screen.getByText('Failed to promote to admin');
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('should delete Account', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers.regular });
    vi.mocked(api.delete).mockResolvedValue({});
    vi.spyOn(authService, 'logout').mockResolvedValue();

    renderProfile();

    await waitFor(() => screen.getByText('Delete Account'));

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getByText('Delete Account'));
    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
    await expect(mockNavigate).toHaveBeenCalledWith(`/login`);
  });

  it('should display error if cannot delete Account', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockReturnValue();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers.regular });
    vi.mocked(api.delete).mockRejectedValue(
      new Error('Admin self-promotion is only available in development'),
    );

    renderProfile();

    await waitFor(() => screen.getByText('Delete Account'));

    fireEvent.click(screen.getByText('Delete Account'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should navigate back to sessions', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers.regular });

    renderProfile();

    await waitFor(() => screen.getByText('Back to Sessions'));
    fireEvent.click(screen.getByRole('button', { name: 'Back to Sessions' }));
    expect(mockNavigate).toHaveBeenCalledWith('/sessions');
  });
});
