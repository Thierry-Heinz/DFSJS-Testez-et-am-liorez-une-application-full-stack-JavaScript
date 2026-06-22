import { Response } from 'express';
import { findAllTeachers, findById } from './teacher.repository';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getAllTeachers(res: Response) {
  try {
    const teachers = findAllTeachers();

    return res.status(200).json(teachers);
  } catch (error: any) {
    console.error('Get teachers error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getTeacherById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }

    const teacherId = parseInt(id);

    if (isNaN(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const teacher = await findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.status(200).json(teacher);
  } catch (error: any) {
    console.error('Get teacher error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
