import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Profile from './Profile';
import { authService } from '../services/auth.service';
import { mockUsers } from '../tests/fixtures';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
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
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers.regular });

    renderProfile();
    await waitFor(() => {
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
  /*   
it('should display loading', () => {});
  it('should display error if api.get fails', () => {});
  it('should fetch user info', () => {});
  it('should show Promote button if dev', () => {});
  it('should delete Account', () => {});
  it('should display error if cannot delete Account', () => {});
  it('should Promote Account', () => {});
  it('should display error if cannot promote Account', () => {});
  it('should navigate back to sessions', () => {}); */
});
