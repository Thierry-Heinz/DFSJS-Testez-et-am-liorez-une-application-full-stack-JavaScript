import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('./session.repository', () => ({
  createSession: vi.fn(),
  findAllSessions: vi.fn(),
  findSessionById: vi.fn(),
  updateSessionById: vi.fn(),
  updateSession: vi.fn(),
  deleteSessionById: vi.fn(),
}));

import {
  createSession,
  findAllSessions,
  findSessionById,
  updateSession,
  deleteSessionById,
} from './session.repository';

import {
  createSessionService,
  getAllSessionsService,
  getSessionByIdService,
  updateSessionService,
  deleteSessionService,
} from './session.service';
import {
  mockAdaptedSession,
  mockAdaptedSessions,
  mockCreateSessionDto,
  mockRawSession,
  mockRawSessions,
} from '../tests/fixtures';
import { UpdateSessionDto } from './dto/session.dto';

const errorMessage = 'Database error';

describe('Test ==> session.service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return session if creation succeedes', async () => {
    vi.mocked(createSession).mockResolvedValue(mockRawSession);
    const session = await createSessionService(mockCreateSessionDto);
    expect(session).toEqual(mockRawSession);
  });

  it('should return all sessions', async () => {
    vi.mocked(findAllSessions).mockResolvedValue(mockRawSessions);
    const sessions = await getAllSessionsService();
    expect(sessions).toEqual(mockAdaptedSessions);
  });

  it('should return error if accessing all sessions fails', async () => {
    vi.mocked(findAllSessions).mockRejectedValue(new Error(errorMessage));
    await expect(getAllSessionsService()).rejects.toThrow(errorMessage);
  });

  it("should return a session by it's id", async () => {
    vi.mocked(findSessionById).mockResolvedValue(mockRawSession);
    const session = await getSessionByIdService(mockRawSession.id);
    expect(session).toEqual(mockAdaptedSession);
  });

  it('should return null if accessing the session fails', async () => {
    vi.mocked(findSessionById).mockRejectedValue(new Error(errorMessage));
    await expect(getSessionByIdService(mockRawSession.id)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should return undefined if the id does not match a session', async () => {
    vi.mocked(findSessionById).mockResolvedValue(null);
    const session = await getSessionByIdService(18);
    expect(session).toBeUndefined();
  });

  it("should update a session by it's id", async () => {
    vi.mocked(updateSession).mockResolvedValue(mockRawSession);
    const updatedSession = await updateSessionService(
      mockRawSession.id,
      mockCreateSessionDto,
    );
    expect(updatedSession).toEqual(mockRawSession);
  });

  it('should update a session with a string date', async () => {
    vi.mocked(updateSession).mockResolvedValue(mockRawSession);
    const updatedSession = await updateSessionService(mockRawSession.id, {
      ...mockCreateSessionDto,
      date: '2024-02-01',
    } as unknown as UpdateSessionDto);
    expect(updatedSession).toEqual(mockRawSession);
    expect(updateSession).toHaveBeenCalledWith(
      mockRawSession.id,
      expect.objectContaining({ date: expect.any(Date) }),
    );
  });

  it('should return an error if the update fails', async () => {
    vi.mocked(updateSession).mockRejectedValue(new Error(errorMessage));
    await expect(
      updateSessionService(mockRawSession.id, mockCreateSessionDto),
    ).rejects.toThrow(errorMessage);
  });

  it("should delete a session by it's id", async () => {
    vi.mocked(deleteSessionById).mockResolvedValue(mockRawSession);
    const deletedSession = await deleteSessionService(mockRawSession.id);
    expect(deletedSession).toEqual(mockRawSession);
    expect(deleteSessionById).toHaveBeenCalledWith(mockRawSession.id);
  });

  it('should return an error if the delete fails', async () => {
    vi.mocked(deleteSessionById).mockRejectedValue(new Error(errorMessage));
    await expect(deleteSessionService(mockRawSession.id)).rejects.toThrow(
      errorMessage,
    );
  });
});
