import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { findById } from '../auth/auth.repository';
import { UserDto } from './dto/user.dto';
import { deleteUser, updateUser } from './user.repository';

const prisma = new PrismaClient();

export async function getUserById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const userId = parseInt(id);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const existingUser = await findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response: UserDto = existingUser;

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteUserById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'You can only delete your own account' });
    }

    const existingUser = await findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteUser(userId);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function promoteUserToAdmin(req: AuthRequest, res: Response) {
  try {
    const isDev = (process.env.NODE_ENV || 'development') === 'development';
    if (!isDev) {
      return res.status(403).json({
        message: 'Admin self-promotion is only available in development',
      });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const existingUser = await findById(req.userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (existingUser.admin) {
      return res.status(200).json({ existingUser });
    }

    const updatedUser = await updateUser(existingUser.id, { admin: true });

    return res.status(200).json({
      updatedUser,
    });
  } catch (error: any) {
    console.error('Promote user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
