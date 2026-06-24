import { z } from 'zod';

export const SessionSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(50),
  date: z.date(),
  description: z.string().max(2500),
  teacherId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSessionSchema = SessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSessionSchema = CreateSessionSchema.partial();

export type SessionDto = z.infer<typeof SessionSchema>;
export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionDto = z.infer<typeof UpdateSessionSchema>;
