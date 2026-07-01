import { vi, describe, it, expect, beforeEach } from 'vitest';
import { verifyToken } from '../utils/jwt.util';
import { authMiddleware, AuthRequest } from './auth.middleware';
import { token } from '../tests/fixtures';
import { Response, NextFunction } from 'express';

vi.mock('../utils/jwt.util', () => ({
  verifyToken: vi.fn(),
}));

const mockReq = (authHeader?: string) =>
  ({
    headers: { authorization: authHeader },
  }) as AuthRequest;

const mockRes = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = vi.fn() as NextFunction;

describe('Test ==> auth.middleware', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return error if token has more than one space', () => {
    const res = mockRes();
    authMiddleware(mockReq('invalidtoken'), res as any, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token format' });
  });

  it('should return error if no token', () => {
    vi.mocked(verifyToken).mockRejectedValue(new Error('No token provided'));
    const res = mockRes();
    authMiddleware(mockReq(), res as any, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  it('should return error if token is not valid', () => {
    vi.mocked(verifyToken).mockReturnValue(null);

    const res = mockRes();
    authMiddleware(mockReq('invalid Token ++'), res as any, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
  });

  it('should return userId from token', () => {
    vi.mocked(verifyToken).mockReturnValue({ userId: 1 });

    const res = mockRes();
    const req = mockReq('Bearer validtoken');
    authMiddleware(req, res as any, mockNext);
    expect(req.userId).toBe(1);
    expect(mockNext).toHaveBeenCalled();
  });
});
