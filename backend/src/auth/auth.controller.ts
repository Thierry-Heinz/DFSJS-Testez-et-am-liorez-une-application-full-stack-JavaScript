import { Request, Response } from 'express';
import { validateUser } from './auth.service';
import { LoginSchema, RegisterSchema } from './dto/auth.dto';

import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { UserResponseDto } from '../user/dto/user.dto';
import { createUserService } from '../user/user.service';
import { AppError } from '../errors/AppError';
import { ErrorMessage } from '../errors/errorMessages';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  LoginSchema.parse({ email, password });

  const existingUser = await validateUser(email, password);
  if (!existingUser) {
    throw new AppError(ErrorMessage.INVALID_CREDENTIALS);
  }

  res.status(200).json(existingUser);
}

export async function register(req: Request, res: Response) {
  const { email, password, firstName, lastName } = req.body;
  RegisterSchema.parse({ email, password, firstName, lastName });

  const existingUser = await validateUser(email);

  if (existingUser) {
    throw new AppError(ErrorMessage.EMAIL_ALREADY_EXISTS);
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
}
