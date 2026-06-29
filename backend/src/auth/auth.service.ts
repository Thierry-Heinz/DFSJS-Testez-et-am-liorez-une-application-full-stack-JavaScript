import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { getUserByEMailService } from '../user/user.service';
import { AppError } from '../errors/AppError';
import { ErrorMessage } from '../errors/errorMessages';

export async function validateUser(email: string, password?: string) {
  const existingUser = await getUserByEMailService(email);

  if (existingUser) {
    if (password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isPasswordValid) {
        throw new AppError(ErrorMessage.INVALID_CREDENTIALS);
      }
    }

    const token = generateToken(existingUser.id);

    return {
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      admin: existingUser.admin,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
      token,
    };
  }
}
