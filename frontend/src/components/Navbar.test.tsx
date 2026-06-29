import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockUsers } from '../tests/fixtures';
import { authService } from '../services/auth.service';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Navbar from './Navbar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderNavbar = () => {
  const router = createMemoryRouter([{ path: '/login', element: <Navbar /> }], {
    initialEntries: ['/login'],
  });
  return render(<RouterProvider router={router} />);
};

describe('Test ===> Navbar', () => {
  it('should display login and register if not authenticated', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    renderNavbar();
    screen.getByText('Yoga Studio');
    screen.getByText('Login');
    screen.getByText('Register');
  });
  it('should display Sessions, Profile and logout if authenticated as regular', () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    renderNavbar();
    screen.getByText('Sessions');
    screen.getByText('Profile');
    screen.getByText('Logout');
  });
  it('should display Sessions, Profile , logout and createSessions if authenticated as admin', () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    renderNavbar();
    screen.getByText('Sessions');
    screen.getByText('Profile');
    screen.getByText('Create Session');
    screen.getByText('Logout');
  });

  it('should navigate to /login if click logout', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    vi.spyOn(authService, 'logout').mockImplementation(() => {});
    renderNavbar();
    const logoutButton = screen.getByRole('button', {
      name: 'Logout',
    });
    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/login`);
    });
    expect(authService.logout).toHaveBeenCalled();
  });
});
