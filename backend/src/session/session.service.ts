import { string } from 'zod';
import { getTeacherByIdService } from '../teacher/teacher.service';
import {
  CreateSessionDto,
  SessionDto,
  UpdateSessionDto,
} from './dto/session.dto';
import {
  createSession,
  deleteSessionById,
  findAllSessions,
  findSessionById,
} from './session.repository';

export async function createSessionService(createSessionDto: CreateSessionDto) {
  return await createSession(createSessionDto);
}

export async function getAllSessions(): Promise<SessionDto[]> {
  return await findAllSessions();
}

export async function getSessionByIdService(
  id: number,
): Promise<SessionDto | null> {
  return await findSessionById(id);
}

export async function updateSessionService(
  updateSessionDto: UpdateSessionDto,
  {
    name,
    date,
    description,
    teacherId,
  }: { name: string; date: Date; description: string; teacherId: number },
) {
  if (name) updateSessionDto.name = name;
  if (date) updateSessionDto.date = new Date(date);
  if (description) updateSessionDto.description = description;
  if (teacherId) {
    const teacher = await getTeacherByIdService(teacherId);

    if (teacher) {
      updateSessionDto.teacherId = teacherId;
    }
  }
  return updateSessionDto;
}

export async function deleteSessionService(id: number) {
  return await deleteSessionById(id);
}
