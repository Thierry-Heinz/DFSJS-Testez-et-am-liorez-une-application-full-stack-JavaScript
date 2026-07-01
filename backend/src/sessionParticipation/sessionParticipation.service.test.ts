import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  mockSessionParticipation,
  mockSessionParticipationDto,
} from '../tests/fixtures';

vi.mock('./sessionParticipation.repository', () => ({
  createSessionparticipation: vi.fn(),
  findSessionParticipationById: vi.fn(),
  deleteSessionParticipationById: vi.fn(),
}));

import {
  createSessionparticipation,
  deleteSessionParticipationById,
  findSessionParticipationById,
} from './sessionParticipation.repository';
import {
  createSessionParticipationService,
  deleteSessionParticipationByIdService,
  getSessionParticipationById,
} from './sessionParticipation.service';

const errorMessage = 'Database error';

describe('Test ==> sessionParticipation.service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return sessionParticipation if creation succeedes', async () => {
    vi.mocked(createSessionparticipation).mockResolvedValue(
      mockSessionParticipationDto,
    );
    await expect(createSessionParticipationService(1, 1)).resolves.toEqual(
      mockSessionParticipationDto,
    );
  });

  it('should return an error if creation fails', async () => {
    vi.mocked(createSessionparticipation).mockRejectedValue(
      new Error(errorMessage),
    );
    await expect(createSessionParticipationService(1, 1)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should return sessionParticipation if find succeedes', async () => {
    vi.mocked(findSessionParticipationById).mockResolvedValue(
      mockSessionParticipation,
    );
    await expect(
      getSessionParticipationById(
        mockSessionParticipationDto.sessionId,
        mockSessionParticipationDto.userId,
      ),
    ).resolves.toEqual(mockSessionParticipation);
  });

  it('should return an error if find fails', async () => {
    vi.mocked(findSessionParticipationById).mockRejectedValue(
      new Error(errorMessage),
    );
    await expect(
      getSessionParticipationById(
        mockSessionParticipationDto.sessionId,
        mockSessionParticipationDto.userId,
      ),
    ).rejects.toThrow(errorMessage);
  });

  it('should return undefined if the id does not match a user', async () => {
    vi.mocked(findSessionParticipationById).mockResolvedValue(null);
    const session = await getSessionParticipationById(
      mockSessionParticipationDto.sessionId,
      mockSessionParticipationDto.userId,
    );
    expect(session).toBeNull();
  });

  it('should return sessionParticipation if delete succeedes', async () => {
    vi.mocked(deleteSessionParticipationById).mockResolvedValue(
      mockSessionParticipationDto,
    );
    await expect(
      deleteSessionParticipationByIdService(
        mockSessionParticipationDto.sessionId,
        mockSessionParticipationDto.userId,
      ),
    ).resolves.toEqual(mockSessionParticipationDto);
  });

  it('should return an error if delete fails', async () => {
    vi.mocked(deleteSessionParticipationById).mockRejectedValue(
      new Error(errorMessage),
    );
    await expect(
      deleteSessionParticipationByIdService(
        mockSessionParticipationDto.sessionId,
        mockSessionParticipationDto.userId,
      ),
    ).rejects.toThrow(errorMessage);
  });
});
