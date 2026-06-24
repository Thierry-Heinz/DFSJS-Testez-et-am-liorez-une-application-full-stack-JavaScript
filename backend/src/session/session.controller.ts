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

const prisma = new PrismaClient();

export async function getAllSessions(req: AuthRequest, res: Response) {
  try {
    const sessions = await getAllSessionsService();

    return res.status(200).json(sessions);
  } catch (error: unknown) {
    console.error('Get sessions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getSessionById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const session = await getSessionByIdService(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    return res.status(200).json(session);
  } catch (error: unknown) {
    console.error('Get session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createSession(req: AuthRequest, res: Response) {
  try {
    const { name, date, description, teacherId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (isNaN(req.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await getUserByIdService(req.userId);

    if (!user || !user.admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const teacher = await getTeacherByIdService(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const session = createSessionService({
      name,
      date: new Date(date),
      description,
      teacherId,
    });

    return res.status(201).json(session);
  } catch (error: unknown) {
    console.error('Create session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateSession(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { name, date, description, teacherId } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await getUserByIdService(req.userId);

    if (!user || !user.admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const existingSession = await getSessionByIdService(sessionId);

    if (!existingSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const updatedData = { name, date, description, teacherId };

    const updatedSession = await updateSessionService(sessionId, updatedData);

    console.log('updated session', updatedSession);

    return res.status(200).json(updatedSession);
  } catch (error: unknown) {
    console.error('Update session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteSession(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    if (req.userId) {
      const existingUser = await getUserByIdService(req.userId);
      if (!existingUser || !existingUser.admin) {
        return res.status(403).json({ message: 'Admin access required' });
      }
    }

    const existingSession = await getSessionByIdService(sessionId);

    if (!existingSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await deleteSessionService(sessionId);

    return res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function participate(req: AuthRequest, res: Response) {
  try {
    const { id, userId } = req.params as { id: string; userId: string };

    if (!id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const sessionId = parseInt(id);
    const participantUserId = parseInt(userId);

    if (isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }
    if (isNaN(participantUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const session = await getSessionByIdService(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const user = await getUserByIdService(participantUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingParticipation = await getSessionParticipationById(
      session.id,
      user.id,
    );

    if (existingParticipation) {
      return res
        .status(400)
        .json({ message: 'User already participating in this session' });
    }

    await createSessionParticipationService(session.id, user.id);

    return res.status(200).json({ message: 'Successfully joined the session' });
  } catch (error: unknown) {
    console.error('Participate error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function unparticipate(req: AuthRequest, res: Response) {
  try {
    const { id, userId } = req.params as { id: string; userId: string };

    if (!id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const sessionId = parseInt(id);
    const participantUserId = parseInt(userId);

    if (isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }
    if (isNaN(participantUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const participation = await getSessionParticipationById(
      sessionId,
      participantUserId,
    );

    if (!participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }

    await deleteSessionParticipationByIdService(sessionId, participantUserId);

    return res.status(200).json({ message: 'Successfully left the session' });
  } catch (error: unknown) {
    console.error('Unparticipate error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
