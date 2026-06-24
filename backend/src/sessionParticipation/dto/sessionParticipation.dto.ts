import { z } from 'zod';
import { UserSchema } from '../../user/dto/user.dto';
import { TeacherSchema } from '../../teacher/dto/teacher.dto';

export const SessionParticipationPartialSchema = z.object({
  sessionId: z.number(),
  userId: z.number(),
});

const SessionParticipationSchema = SessionParticipationPartialSchema.extend({
  user: UserSchema,
});

export type SessionParticipationDto = z.infer<
  typeof SessionParticipationSchema
>;
