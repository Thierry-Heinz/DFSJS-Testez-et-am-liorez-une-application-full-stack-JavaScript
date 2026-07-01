import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app';
import { mockUserDto } from './fixtures';

const prisma = new PrismaClient();

export async function getAuthToken(admin = false, email = mockUserDto.email) {
  const user = await prisma.user.create({
    data: {
      ...mockUserDto,
      email,
      admin,
      password: await bcrypt.hash(mockUserDto.password, 10),
    },
  });
  const res = await request(app).post('/api/auth/login').send({
    email: mockUserDto.email,
    password: mockUserDto.password,
  });
  return { token: res.body.token, userId: user.id };
}

export async function createTeacher() {
  return await prisma.teacher.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
    },
  });
}

export async function createSession(teacherId: number) {
  return await prisma.session.create({
    data: {
      name: 'Morning Yoga',
      date: new Date('2024-01-15'),
      description: 'A relaxing morning session',
      teacherId,
    },
  });
}

export async function createSessionParticipation(
  sessionId: number,
  userId: number,
) {
  return await prisma.sessionParticipation.create({
    data: { sessionId, userId },
  });
}
