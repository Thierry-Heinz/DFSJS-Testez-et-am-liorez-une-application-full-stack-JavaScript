import { SessionParticipationDto } from '../sessionParticipation/dto/sessionParticipation.dto';
import { TeacherDto } from '../teacher/dto/teacher.dto';

import { SessionDto } from './dto/session.dto';

interface SessionAdapter extends SessionDto {
  participants: SessionParticipationDto[];
  teacher: TeacherDto;
}

export function sessionAdapter(session: SessionAdapter) {
  const { participants: users, ...sessionWithoutParticipants } = session;
  const usersId = users.map((user) => user.userId);
  return { users: usersId, ...sessionWithoutParticipants };
}
