import { Request, Response } from 'express';
import { validateUser } from './auth.service';
import { LoginSchema, RegisterSchema } from './dto/auth.dto';

import * as bcrypt from 'bcrypt';
import z from 'zod';
import { generateToken } from '../utils/jwt.util';
import { UserResponseDto } from '../user/dto/user.dto';
import { createUserService } from '../user/user.service';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    LoginSchema.parse({ email, password });

    const existingUser = await validateUser(email, password);
    if (!existingUser) {
      throw new Error('Invalid Credentials');
    }

    return res.status(200).json(existingUser);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;
    RegisterSchema.parse({ email, password, firstName, lastName });

    const existingUser = await validateUser(email);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUserService({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      admin: false,
    });

    const token = generateToken(user.id);

    const response: UserResponseDto = { ...user, token };

    return res.status(201).json(response);
  } catch (error: unknown) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
