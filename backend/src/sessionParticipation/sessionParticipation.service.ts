import {
  createSessionparticipation,
  deleteSessionParticipationById,
  findSessionParticipationById,
} from './sessionParticipation.repository';

export async function createSessionParticipationService(
  sessionId: number,
  userId: number,
) {
  return await createSessionparticipation(sessionId, userId);
}

export async function getSessionParticipationById(
  sessionId: number,
  userId: number,
) {
  return await findSessionParticipationById(sessionId, userId);
}

export async function deleteSessionParticipationByIdService(
  sessionId: number,
  userId: number,
) {
  return await deleteSessionParticipationById(sessionId, userId);
}
