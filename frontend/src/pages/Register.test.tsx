import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { authService } from '../services/auth.service';
import Register from './Register';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Test ==> Register', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mount Register page', () => {
    screen.getByText('Register for Yoga Studio');
    screen.getByLabelText('First Name');
    screen.getByLabelText('Last Name');
    screen.getByLabelText('Email');
    screen.getByLabelText('Password');
    screen.getByRole('button', { name: 'Register' });
    screen.getByText('Login here');
  });

  it('displays error when register fails', async () => {
    const errorMessage = 'Email already exists';
    vi.spyOn(authService, 'register').mockRejectedValue(
      new Error(errorMessage),
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('navigates to /sessions on successful register', async () => {
    vi.spyOn(authService, 'register').mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'test',
      admin: false,
    });

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sessions');
    });
  });
});
