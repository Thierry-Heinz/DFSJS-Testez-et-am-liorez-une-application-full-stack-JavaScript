import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { findUserByEmail } from '../user/user.repository';
import { getUserByEMailService } from '../user/user.service';

export async function validateUser(email: string, password?: string) {
  const existingUser = await getUserByEMailService(email);

  if (existingUser) {
    if (password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isPasswordValid) {
        throw new Error('Invalid Credentials');
      }
    }

    const token = generateToken(existingUser.id);

    return {
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      admin: existingUser.admin,
      token,
    };
  }
}
