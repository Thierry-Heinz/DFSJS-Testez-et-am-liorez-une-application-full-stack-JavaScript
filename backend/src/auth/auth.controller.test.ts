import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { mockRegisterData, mockUser, mockUserDto } from '../tests/fixtures';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('should create a user and return 201 with token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockRegisterData);
    expect(res.status).toBe(201);
  });

  it('should return an error if email already exists', async () => {
    await prisma.user.create({ data: mockUserDto });
    const rest = await request(app)
      .post('/api/auth/register')
      .send({ ...mockRegisterData, email: 'test@test.com' });
    expect(rest.status).toBe(409);
  });

  it('should return an error if body is invalid', async () => {
    const rest = await request(app)
      .post('/api/auth/register')
      .send({ ...mockRegisterData, email: 'testattest.com' });
    expect(rest.status).toBe(400);
  });
});
const mockLoginData = {
  email: 'test@test.com',
  password: 'test!1234',
};

describe('POST /api/auth/login', () => {
  it('should return 200 with user and token', async () => {
    await prisma.user.create({
      data: {
        ...mockUserDto,
        password: await bcrypt.hash(mockUserDto.password, 10),
      },
    });
    const rest = await request(app).post('/api/auth/login').send(mockLoginData);
    expect(rest.status).toBe(200);
  });

  it('should return an error if credentials are invalid', async () => {
    await prisma.user.create({
      data: {
        ...mockUserDto,
        password: await bcrypt.hash(mockUserDto.password, 10),
      },
    });
    const rest = await request(app)
      .post('/api/auth/login')
      .send({ ...mockLoginData, password: 'test!1235' });
    expect(rest.status).toBe(401);
  });
});
