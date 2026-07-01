import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: vi.fn().mockReturnValue('mockedToken'),
      verify: vi.fn().mockReturnValue({ userId: 1 }),
    },
  };
});
import { generateToken, verifyToken } from './jwt.util';
import jwt from 'jsonwebtoken';

describe('Test ==> jwt.util', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(jwt.sign).mockReturnValue('mockedToken' as any);
    vi.mocked(jwt.verify).mockReturnValue({ userId: 1 } as any);
  });

  it('should generate a token', () => {
    const token = generateToken(1);

    expect(token).toBe('mockedToken');
  });

  it('should verify a token', () => {
    const decoded = verifyToken('mockedToken');
    expect(decoded).toEqual({ userId: 1 });
  });

  it('should return null for invalid token', () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const decoded = verifyToken('invalidToken');
    expect(decoded).toBeNull();
  });
});
