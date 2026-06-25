import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';
import { authService } from '../services/auth.service';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Test ==> Login', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
  });

  it('mount Login page', () => {
    screen.getByText('Login to Yoga Studio');
    screen.getByLabelText('Email');
    screen.getByLabelText('Password');
    screen.getByRole('button', { name: 'Login' });
    screen.getByText('Register here');
  });

  it('displays error when login fails', async () => {
    vi.spyOn(authService, 'login').mockRejectedValue(
      new Error('Invalid credentials'),
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('navigates to /sessions on successful login', async () => {
    vi.spyOn(authService, 'login').mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'test',
      admin: false,
    });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sessions');
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
});
