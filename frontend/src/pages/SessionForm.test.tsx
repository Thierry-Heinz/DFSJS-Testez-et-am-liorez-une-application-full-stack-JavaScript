import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockSessions, mockTeachers, mockUsers } from '../tests/fixtures';
import { authService } from '../services/auth.service';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import SessionForm from './SessionForm';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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

const renderSessionForm = (editId?: number) => {
  const router = createMemoryRouter(
    [
      { path: '/sessions/create', element: <SessionForm /> },
      { path: '/sessions/edit/:id', element: <SessionForm /> },
    ],
    {
      initialEntries: [
        editId ? `/sessions/edit/${editId}` : '/sessions/create',
      ],
    },
  );
  return render(<RouterProvider router={router} />);
};

describe('Test ===> Session Form', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should mount', () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    renderSessionForm(1);

    screen.getByText('Edit Session');
    screen.getByText('Session Name');
    screen.getByText('Date');
    screen.getByText('Teacher');
    screen.getByText('Description');
    screen.getByText('Update Session');
    screen.getByText('Cancel');
  });

  it('should be edit mode in editing and display session data', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({
        data: mockSessions[0],
      });

    renderSessionForm(1);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Yoga Vinyasa')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2026-02-15')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(
          'Un cours dynamique qui synchronise le mouvement et la respiration. Idéal pour renforcer le corps et améliorer la flexibilité.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('Margot Delahaye')).toBeInTheDocument();
    });
  });

  it('should be create mode if creating', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTeachers });

    renderSessionForm();

    await waitFor(() => {
      expect(screen.getByText('Create New Session'));
      expect(screen.getByText('Margot Delahaye')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Session' }));
    });
  });

  it('should fetch Teachers', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTeachers });

    renderSessionForm(1);

    await waitFor(() => {
      expect(screen.getByText('Edit Session'));
      expect(screen.getByText('Margot Delahaye')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Update Session' }));
    });
  });

  it('should display error if fetch Teachers fails', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.spyOn(console, 'error').mockReturnValue();
    vi.mocked(api.get).mockRejectedValue(new Error('Internal server error'));

    renderSessionForm(1);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should fetch Sessions', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({
        data: mockSessions[0],
      });

    renderSessionForm(1);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Yoga Vinyasa')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2026-02-15')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(
          'Un cours dynamique qui synchronise le mouvement et la respiration. Idéal pour renforcer le corps et améliorer la flexibilité.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should display error if fetch Sessions fails', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockRejectedValue(new Error('Invalid session ID'));

    vi.spyOn(console, 'error').mockReturnValue();

    renderSessionForm(1);

    await waitFor(() => {
      expect(screen.getByText('Failed to load session'));
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should submit form in edit mode', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({ data: mockSessions[0] });
    vi.mocked(api.put).mockResolvedValue({});

    renderSessionForm(1);

    await waitFor(() => screen.getByDisplayValue('Yoga Vinyasa'));

    fireEvent.submit(screen.getByRole('button', { name: 'Update Session' }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/sessions');
    });
  });

  it('should submit form in create mode', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({ data: mockTeachers });
    vi.mocked(api.post).mockResolvedValue({});

    renderSessionForm();

    await waitFor(() => screen.getByText('Margot Delahaye'));

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], {
      target: { name: 'name', value: 'Yoga test' },
    });
    fireEvent.change(inputs[1], {
      target: { name: 'description', value: 'Une description test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Create Session' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/sessions');
    });
  });

  it('should  display error if form submission has failed for server reason', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({ data: mockTeachers });
    vi.mocked(api.post).mockRejectedValue(new Error('Name is required'));

    renderSessionForm();

    await waitFor(() => screen.getByText('Margot Delahaye'));

    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[1], {
      target: { name: 'description', value: 'Une description test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Create Session' }));

    await waitFor(() => {
      screen.getByText('Name is required');
    });
  });

  it('should redirect if User is not admin', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({ data: mockTeachers });

    renderSessionForm();

    await waitFor(() => screen.getByText('Margot Delahaye'));

    expect(mockNavigate).toHaveBeenCalledWith('/sessions');
  });

  it('should redirect if Cancel button is clicked', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockTeachers })
      .mockResolvedValue({ data: mockTeachers });

    renderSessionForm();

    await waitFor(() => screen.getByText('Margot Delahaye'));

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockNavigate).toHaveBeenCalledWith('/sessions');
  });
});
