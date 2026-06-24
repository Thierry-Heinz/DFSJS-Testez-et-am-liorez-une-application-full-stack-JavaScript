import { z } from 'zod';

export const TeacherSchema = z.object({
  id: z.number(),
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TeacherDto = z.infer<typeof TeacherSchema>;
