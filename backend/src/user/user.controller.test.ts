import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import { getAuthToken } from '../tests/helpers';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('GET /api/user/:id', () => {
  it('should return 200 with user', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });
  it('should return error if user id is not a number', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/user/abc`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return error if user not found', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/user/10`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return error if user not authenticated', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app).get(`/api/user/${userId}`);
    expect(rest.status).toBe(401);
  });
});

describe('POST /api/user/promote-admin', () => {
  it('should return 200 with user', async () => {
    process.env.NODE_ENV = 'development';
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/user/promote-admin`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return error if env is not in dev', async () => {
    const { token, userId } = await getAuthToken(true);
    const rest = await request(app)
      .post(`/api/user/promote-admin`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(403);
  });

  it('should return 200 if user is already admin', async () => {
    process.env.NODE_ENV = 'development';
    const { token, userId } = await getAuthToken(true);
    const rest = await request(app)
      .post(`/api/user/promote-admin`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });
  it('should return error if user not authenticated', async () => {
    process.env.NODE_ENV = 'development';
    const rest = await request(app).post(`/api/user/promote-admin`);
    expect(rest.status).toBe(401);
  });
});

describe('DELETE /api/user/:id', () => {
  it('should return 200 with user', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .delete(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });
  it('should return error if user id is not a number', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .delete(`/api/user/abc`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return error if user not found', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .delete(`/api/user/10`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return error if user not authenticated', async () => {
    const { token, userId } = await getAuthToken();
    const rest = await request(app).delete(`/api/user/${userId}`);
    expect(rest.status).toBe(401);
  });
  it('should return error if not deleting his own account', async () => {
    const { token: token1, userId: userId1 } = await getAuthToken();
    const { token: token2, userId: userId2 } = await getAuthToken(
      false,
      'test@test.com',
    );
    const rest = await request(app)
      .delete(`/api/user/${userId2}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(rest.status).toBe(403);
  });
});
