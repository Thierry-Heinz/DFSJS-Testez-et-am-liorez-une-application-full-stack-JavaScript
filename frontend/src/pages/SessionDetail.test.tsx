import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SessionDetail from './SessionDetail';
import { useSession } from '../hooks/useSession';
import { errorSession, mockSessions, mockUsers } from '../tests/fixtures';
import { authService } from '../services/auth.service';
import { useParticipation } from '../hooks/useParticipation';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../hooks/useSession', () => ({
  useSession: vi.fn(),
}));

vi.mock('../hooks/useParticipation', () => ({
  useParticipation: vi.fn(),
}));

const renderSessionDetail = () => {
  const router = createMemoryRouter(
    [{ path: '/sessions/:id', element: <SessionDetail /> }],
    { initialEntries: ['/sessions/1'] },
  );
  return render(<RouterProvider router={router} />);
};

describe('Test ===> SessionDetail', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should mount', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);
    renderSessionDetail();
    screen.getByText('Yoga Vinyasa');
    screen.getByText('Details');
    screen.getByText('Margot Delahaye');
    screen.getByText(
      'Un cours dynamique qui synchronise le mouvement et la respiration. Idéal pour renforcer le corps et améliorer la flexibilité.',
    );

    screen.getByText('Join Session');
  });

  it('should display Loading', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: true,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);

    renderSessionDetail();

    screen.getByText('Loading session...');
  });

  it('should navigate to session if user is not found', () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(null);

    renderSessionDetail();

    expect(mockNavigate).toHaveBeenCalledWith(`/sessions`);
  });

  it('should display error from the fetch', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: errorSession,
      error: 'Invalid session ID',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);

    renderSessionDetail();
    screen.getByText('Invalid session ID');
  });
  it('should display Session not found', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: errorSession,
      error: 'Session not found',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);

    renderSessionDetail();
    screen.getByText('Session not found');
  });

  it('should display Edit and Delete buttons if user is admin', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);

    renderSessionDetail();

    screen.getByText('Edit');
    screen.getByText('Delete');
  });

  it('should navigate to SessionForm if admin click edit', async () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);

    renderSessionDetail();

    const editButton = screen.getByRole('button', { name: 'Edit' });

    fireEvent.click(editButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        `/sessions/edit/${mockSessions[0].id}`,
      );
    });
  });

  it('should delete Session if admin click delete', async () => {
    const deleteSession = vi
      .fn()
      .mockImplementation((_id, callback) => callback());

    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession,
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);

    renderSessionDetail();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(deleteButton);
    expect(deleteSession).toHaveBeenCalledWith(
      mockSessions[0].id,
      expect.any(Function),
    );
    await expect(mockNavigate).toHaveBeenCalledWith(`/sessions`);
  });

  it('should navigate back to session', async () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);

    renderSessionDetail();

    const backButton = screen.getByRole('button', {
      name: 'Back to Sessions',
    });
    fireEvent.click(backButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/sessions`);
    });
  });

  it('should succeed in participation subscription and display Leave Session button', () => {
    const participate = vi.fn();

    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate,
      unparticipate: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);

    renderSessionDetail();

    const participateButton = screen.getByRole('button', {
      name: 'Join Session',
    });
    fireEvent.click(participateButton);
    expect(participate).toHaveBeenCalled();
  });

  it('should succeed in unparticipation subscription and display Join Session button', () => {
    const unparticipate = vi.fn();

    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[1],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useParticipation).mockReturnValue({
      participate: vi.fn(),
      unparticipate,
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.regular);

    renderSessionDetail();

    const unparticipateButton = screen.getByRole('button', {
      name: 'Leave Session',
    });
    fireEvent.click(unparticipateButton);
    expect(unparticipate).toHaveBeenCalled();
  });
});
