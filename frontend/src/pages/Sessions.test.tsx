import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sessions from './Sessions';
import { useSession } from '../hooks/useSession';
import { errorSession, mockSessions, mockUsers } from '../tests/fixtures';
import { authService } from '../services/auth.service';

vi.mock('../hooks/useSession', () => ({
  useSession: vi.fn(),
}));

describe('Test ===> Sessions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );
    screen.getByText('Yoga Sessions');
    screen.getByText('Yoga Vinyasa');
    screen.getByText('Yoga Hatha');
    screen.getByText('Yoga Ashtanga');
    screen.getByText('Yin Yoga');
  });

  it("display no sessions if doesn't find any", () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: [],
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );

    screen.getByText('Yoga Sessions');
    screen.getByText('No sessions available');
  });

  it('display error when fetch fails', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: [],
      session: errorSession,
      error: 'Internal server error',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );

    screen.getByText('Internal server error');
  });

  it('should delete sessions when succeed', () => {
    const deleteSession = vi.fn();
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession,
      refetch: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(deleteButtons[0]);
    expect(deleteSession).toHaveBeenCalledWith(mockSessions[0].id);
  });

  it('should do nothing if user cancel deletion', () => {
    const deleteSession = vi.fn();
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession,
      refetch: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(deleteButtons[0]);
    expect(deleteSession).not.toHaveBeenCalled();
  });

  it('should show create session if admin', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: false,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUsers.admin);
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );
    screen.getByText('Create Session');
  });

  it('should show Loading', () => {
    vi.mocked(useSession).mockReturnValue({
      sessions: mockSessions,
      session: mockSessions[0],
      error: '',
      loading: true,
      deleteSession: vi.fn(),
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>,
    );
    screen.getByText('Loading sessions...');
  });
});
