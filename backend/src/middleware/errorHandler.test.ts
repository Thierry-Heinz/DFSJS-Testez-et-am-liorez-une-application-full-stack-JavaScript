import { vi, describe, it, expect, beforeEach } from 'vitest';

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import errorHandler from './errorHandler';
import { AppError } from '../errors/AppError';
import { ErrorMessage } from '../errors/errorMessages';
import { ZodError } from 'zod';

const mockReq = (authHeader?: string) =>
  ({
    headers: { authorization: authHeader },
  }) as AuthRequest;

const mockRes = (headersSent = false) => ({
  headersSent,
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});
const mockNext = vi.fn() as NextFunction;

describe('Test ==> errorHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return next error if res.headersSent is true', () => {
    const res = mockRes(true);
    errorHandler(
      new AppError(ErrorMessage.ADMIN_REQUIRED),
      mockReq('invalidtoken'),
      res as any,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalledWith(
      new AppError(ErrorMessage.ADMIN_REQUIRED),
    );
  });

  it('should return error if instance of AppError', () => {
    const res = mockRes();
    errorHandler(
      new AppError(ErrorMessage.ADMIN_REQUIRED),
      mockReq('invalidtoken'),
      res as any,
      mockNext,
    );
    expect(res.status).toHaveBeenCalledWith(
      ErrorMessage.ADMIN_REQUIRED.statusCode,
    );
    expect(res.json).toHaveBeenCalledWith({
      error: { message: ErrorMessage.ADMIN_REQUIRED.message },
    });
  });

  it('should return error if instance of zodError', () => {
    const res = mockRes();
    errorHandler(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['field'],
          message: 'Invalid input',
        },
      ]),
      mockReq('invalidtoken'),
      res as any,
      mockNext,
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: ['Invalid input'] },
    });
  });

  it('should return error if instance of server error', () => {
    const res = mockRes();
    errorHandler(
      new Error('Internal server error'),
      mockReq('invalidtoken'),
      res as any,
      mockNext,
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Internal server error' },
    });
  });
});
