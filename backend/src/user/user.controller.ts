import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  deleteUserByIdService,
  getUserByIdService,
  updateUserByIdService,
} from './user.service';
import { AppError } from '../errors/AppError';
import { ErrorMessage } from '../errors/errorMessages';
import { SuccessMessage } from '../utils/successMessages';

export async function getUserById(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };
  if (!id) {
    throw new AppError(ErrorMessage.USER_ID_REQUIRED);
  }

  const userId = parseInt(id);

  if (isNaN(userId)) {
    throw new AppError(ErrorMessage.INVALID_USER_ID);
  }

  const existingUser = await getUserByIdService(userId);

  if (!existingUser) {
    throw new AppError(ErrorMessage.USER_NOT_FOUND);
  }

  res.status(200).json(existingUser);
}

export async function deleteUserById(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };

  if (!id) {
    throw new AppError(ErrorMessage.USER_ID_REQUIRED);
  }

  const userId = parseInt(id);

  if (isNaN(userId)) {
    throw new AppError(ErrorMessage.INVALID_USER_ID);
  }
  const existingUser = await getUserByIdService(userId);

  if (!existingUser) {
    throw new AppError(ErrorMessage.USER_NOT_FOUND);
  }
  if (req.userId !== userId) {
    throw new AppError(ErrorMessage.DELETE_OWN_ACCOUNT_ONLY);
  }

  await deleteUserByIdService(userId);
  res.status(200).json({ message: SuccessMessage.USER_DELETED });
}

export async function promoteUserToAdmin(req: AuthRequest, res: Response) {
  const isDev = (process.env.NODE_ENV || 'development') === 'development';

  if (!req.userId) {
    throw new AppError(ErrorMessage.UNAUTHORIZED);
  }
  if (!isDev) {
    throw new AppError(ErrorMessage.ADMIN_SELF_PROMOTION_DEV_ONLY);
  }

  const existingUser = await getUserByIdService(req.userId);

  if (!existingUser) {
    throw new AppError(ErrorMessage.USER_NOT_FOUND);
  }

  if (existingUser.admin) {
    res.status(200).json(existingUser);
  }

  const updatedUser = await updateUserByIdService(existingUser.id, {
    admin: true,
  });

  res.status(200).json({
    ...updatedUser,
  });
}
