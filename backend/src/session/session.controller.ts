import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

import {
  createSessionService,
  deleteSessionService,
  getAllSessionsService,
  getSessionByIdService,
  updateSessionService,
} from './session.service';
import { getUserByIdService } from '../user/user.service';
import { getTeacherByIdService } from '../teacher/teacher.service';
import {
  createSessionParticipationService,
  deleteSessionParticipationByIdService,
  getSessionParticipationById,
} from '../sessionParticipation/sessionParticipation.service';
import { AppError } from '../errors/AppError';
import { ErrorMessage } from '../errors/errorMessages';
import { SuccessMessage } from '../utils/successMessages';

export async function getAllSessions(req: AuthRequest, res: Response) {
  const sessions = await getAllSessionsService();

  res.status(200).json(sessions);
}

export async function getSessionById(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };

  if (!id) {
    throw new AppError(ErrorMessage.SESSION_ID_REQUIRED);
  }

  const sessionId = parseInt(id);

  if (isNaN(sessionId)) {
    throw new AppError(ErrorMessage.INVALID_SESSION_ID);
  }

  const session = await getSessionByIdService(sessionId);
  if (!session) {
    throw new AppError(ErrorMessage.SESSION_NOT_FOUND);
  }

  res.status(200).json(session);
}

export async function createSession(req: AuthRequest, res: Response) {
  const { name, date, description, teacherId } = req.body;

  if (!name) {
    throw new AppError(ErrorMessage.NAME_REQUIRED);
  }
  if (!date) {
    throw new AppError(ErrorMessage.DATE_REQUIRED);
  }
  if (!description) {
    throw new AppError(ErrorMessage.DESCRIPTION_REQUIRED);
  }
  if (!teacherId) {
    throw new AppError(ErrorMessage.TEACHER_ID_REQUIRED);
  }
  if (!req.userId) {
    throw new AppError(ErrorMessage.UNAUTHORIZED);
  }
  if (isNaN(req.userId)) {
    throw new AppError(ErrorMessage.USER_ID_REQUIRED);
  }

  const user = await getUserByIdService(req.userId);

  if (!user || !user.admin) {
    throw new AppError(ErrorMessage.ADMIN_REQUIRED);
  }

  const teacher = await getTeacherByIdService(teacherId);

  if (!teacher) {
    throw new AppError(ErrorMessage.TEACHER_NOT_FOUND);
  }
  const session = await createSessionService({
    name,
    date: new Date(date),
    description,
    teacherId,
  });

  res.status(201).json(session);
}

export async function updateSession(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };
  const { name, date, description, teacherId } = req.body;

  if (!id) {
    throw new AppError(ErrorMessage.SESSION_ID_REQUIRED);
  }

  const sessionId = parseInt(id);

  if (isNaN(sessionId)) {
    throw new AppError(ErrorMessage.INVALID_SESSION_ID);
  }
  if (!req.userId) {
    throw new AppError(ErrorMessage.UNAUTHORIZED);
  }
  const user = await getUserByIdService(req.userId);

  if (!user || !user.admin) {
    throw new AppError(ErrorMessage.ADMIN_REQUIRED);
  }

  const existingSession = await getSessionByIdService(sessionId);

  if (!existingSession) {
    throw new AppError(ErrorMessage.SESSION_NOT_FOUND);
  }

  const existingTeacher = getTeacherByIdService(teacherId);
  if (!existingTeacher) {
    throw new AppError(ErrorMessage.INVALID_TEACHER_ID);
  }

  const updatedData = { name, date, description, teacherId };

  const updatedSession = await updateSessionService(sessionId, updatedData);

  res.status(200).json(updatedSession);
}

export async function deleteSession(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };

  if (!id) {
    throw new AppError(ErrorMessage.SESSION_ID_REQUIRED);
  }

  const sessionId = parseInt(id);

  if (isNaN(sessionId)) {
    throw new AppError(ErrorMessage.INVALID_SESSION_ID);
  }

  if (!req.userId) {
    throw new AppError(ErrorMessage.UNAUTHORIZED);
  }
  const existingUser = await getUserByIdService(req.userId);
  if (!existingUser || !existingUser.admin) {
    throw new AppError(ErrorMessage.ADMIN_REQUIRED);
  }

  const existingSession = await getSessionByIdService(sessionId);

  if (!existingSession) {
    throw new AppError(ErrorMessage.SESSION_NOT_FOUND);
  }

  await deleteSessionService(sessionId);

  res.status(200).json({ message: SuccessMessage.SESSION_DELETED });
}

export async function participate(req: AuthRequest, res: Response) {
  const { id, userId } = req.params as { id: string; userId: string };

  if (!id) {
    throw new AppError(ErrorMessage.SESSION_ID_REQUIRED);
  }
  if (!userId) {
    throw new AppError(ErrorMessage.USER_ID_REQUIRED);
  }

  const sessionId = parseInt(id);
  const participantUserId = parseInt(userId);

  if (isNaN(sessionId)) {
    throw new AppError(ErrorMessage.INVALID_SESSION_ID);
  }
  if (isNaN(participantUserId)) {
    throw new AppError(ErrorMessage.INVALID_USER_ID);
  }

  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new AppError(ErrorMessage.SESSION_NOT_FOUND);
  }

  const user = await getUserByIdService(participantUserId);

  if (!user) {
    throw new AppError(ErrorMessage.USER_NOT_FOUND);
  }

  const existingParticipation = await getSessionParticipationById(
    session.id,
    user.id,
  );

  if (existingParticipation) {
    throw new AppError(ErrorMessage.ALREADY_PARTICIPATING);
  }

  await createSessionParticipationService(session.id, user.id);

  res.status(200).json({ message: SuccessMessage.SESSION_JOINED });
}

export async function unparticipate(req: AuthRequest, res: Response) {
  const { id, userId } = req.params as { id: string; userId: string };

  if (!id) {
    throw new AppError(ErrorMessage.SESSION_ID_REQUIRED);
  }
  if (!userId) {
    throw new AppError(ErrorMessage.USER_ID_REQUIRED);
  }

  const sessionId = parseInt(id);
  const participantUserId = parseInt(userId);

  if (isNaN(sessionId)) {
    throw new AppError(ErrorMessage.INVALID_SESSION_ID);
  }
  if (isNaN(participantUserId)) {
    throw new AppError(ErrorMessage.INVALID_USER_ID);
  }

  const participation = await getSessionParticipationById(
    sessionId,
    participantUserId,
  );

  if (!participation) {
    throw new AppError(ErrorMessage.PARTICIPATION_NOT_FOUND);
  }

  await deleteSessionParticipationByIdService(sessionId, participantUserId);

  res.status(200).json({ message: SuccessMessage.SESSION_LEFT });
}
