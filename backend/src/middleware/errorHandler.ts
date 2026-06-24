import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import z from 'zod';

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(error);
    return;
  }

  // Custom Error Handling
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
    return;
  }

  // Zod Error Handling
  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: {
        message: error.issues.map((i) => i.message),
      },
    });
    return;
  }

  // Server Error Handling
  res.status(500).json({
    error: {
      message: 'Internal server error',
    },
  });
}
