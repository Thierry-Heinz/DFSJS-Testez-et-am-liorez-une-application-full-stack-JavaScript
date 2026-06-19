import { Request, Response } from 'express';
import { validateUser } from './auth.service';
import { LoginSchema } from './dto/auth.dto';
import z from 'zod';

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      LoginSchema.parse({ email, password });

      const existingUser = await validateUser(email, password);

      return res.status(200).json(existingUser);
    } catch (error:unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.issues });
      }
      const message = error instanceof Error ? error.message : 'Unauthorized';
      return res.status(401).json({ message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      if (!firstName) {
        return res.status(400).json({ message: 'First name is required' });
      }
      if (!lastName) {
        return res.status(400).json({ message: 'Last name is required' });
      }
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: 'Password must be at least 8 characters' });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          admin: false,
        },
      });

      const token = generateToken(user.id);

      const response: any = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin,
        token,
      };

      return res.status(201).json(response);
    } catch (error: any) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
