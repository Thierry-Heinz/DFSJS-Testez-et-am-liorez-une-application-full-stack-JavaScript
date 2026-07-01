import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import { createTeacher, getAuthToken } from '../tests/helpers';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/teacher', () => {
  it('should return 200 with all teachers', async () => {
    const teacher1 = await createTeacher();
    const teacher2 = await createTeacher();

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get('/api/teacher')
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return error if user not authenticated', async () => {
    const teacher1 = await createTeacher();
    const teacher2 = await createTeacher();

    const rest = await request(app).get('/api/teacher');
    expect(rest.status).toBe(401);
  });
});

describe('GET /api/teacher/:id', () => {
  it('should return 200 with teacher', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/teacher/${teacher.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return error if teacher id is not a number', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/teacher/abc`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return error if teacher not found', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/teacher/10`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });

  it('should return error if user not authenticated', async () => {
    const teacher = await createTeacher();

    const rest = await request(app).get(`/api/teacher/${teacher.id}`);
    expect(rest.status).toBe(401);
  });
});
