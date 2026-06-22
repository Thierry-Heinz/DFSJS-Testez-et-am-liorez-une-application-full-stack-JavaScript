import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  password: z.string().min(8),
  admin: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UserResponseSchema = UserSchema.omit({
  password: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  token: z.string(),
});

const UpdateUserSchema = CreateUserSchema.partial();

export type UserDto = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
