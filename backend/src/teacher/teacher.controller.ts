import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  getallTeachersService,
  getTeacherByIdService,
} from './teacher.service';
import { AppError } from '../errors/AppError';
import { ErrorMessage } from '../errors/errorMessages';

export async function getAllTeachers(res: Response) {
  const teachers = await getallTeachersService();
  res.status(200).json(teachers);
}

export async function getTeacherById(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };
  if (!id) {
    throw new AppError(ErrorMessage.TEACHER_ID_REQUIRED);
  }

  const teacherId = parseInt(id);
  if (isNaN(teacherId)) {
    throw new AppError(ErrorMessage.INVALID_TEACHER_ID);
  }

  const teacher = await getTeacherByIdService(teacherId);
  if (!teacher) {
    throw new AppError(ErrorMessage.TEACHER_NOT_FOUND);
  }

  res.status(200).json(teacher);
}
