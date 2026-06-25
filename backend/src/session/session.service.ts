import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import {
  createSession,
  deleteSessionById,
  findAllSessions,
  findSessionById,
  updateSession,
} from './session.repository';
import { sessionAdapter } from './session.utils';

export async function createSessionService(createSessionDto: CreateSessionDto) {
  return await createSession(createSessionDto);
}

export async function getAllSessionsService() {
  const sessions = await findAllSessions();

  return sessions.map(sessionAdapter);
}

export async function getSessionByIdService(id: number) {
  const session = await findSessionById(id);
  if (session) {
    return sessionAdapter(session);
  }
}

export async function updateSessionService(
  sessionId: number,
  updateSessionDto: UpdateSessionDto,
) {
  if (updateSessionDto.date)
    updateSessionDto.date = new Date(updateSessionDto.date);

  return await updateSession(sessionId, updateSessionDto);
}

export async function deleteSessionService(id: number) {
  return await deleteSessionById(id);
}
