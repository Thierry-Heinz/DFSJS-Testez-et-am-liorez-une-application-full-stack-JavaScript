import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import {
  createSession,
  createSessionParticipation,
  createTeacher,
  getAuthToken,
} from '../tests/helpers';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/session', () => {
  it('should return 200 with all sessions', async () => {
    const teacher = await createTeacher();
    await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return an error if user is not authenticated', async () => {
    const rest = await request(app).get('/api/session');
    expect(rest.status).toBe(401);
  });
});

describe('GET /api/session/:id', () => {
  it('should return 200 with the session', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/session/${session.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return an error if session does not exist', async () => {
    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/session/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return an error if sessionId is not a number', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/session/abc`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });

  it('should return an error if user is not authenticated', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const rest = await request(app).get(`/api/session/${session.id}`);
    expect(rest.status).toBe(401);
  });
  it('should return an error if the session is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .get(`/api/session/3`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
});

describe('POST /api/session/createSessions', () => {
  it('should create a session and return 201 with session data', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .post(`/api/session/`)
      .send({
        name: 'Morning Yoga',
        date: '2024-01-15',
        description: 'A relaxing morning session',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(201);
  });
  it('should return an error if session data is invalid', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .post(`/api/session/`)
      .send({
        date: '2024-01-15',
        description: 'A relaxing morning session',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return an error if teacherId does not exist', async () => {
    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .post(`/api/session/`)
      .send({
        name: 'Morning Yoga',
        date: '2024-01-15',
        description: 'A relaxing morning session',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return an error if user is not admin', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/session/`)
      .send({
        name: 'Morning Yoga',
        date: '2024-01-15',
        description: 'A relaxing morning session',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(403);
  });
  it('should return an error if user is not authenticated', async () => {
    const teacher = await createTeacher();
    const rest = await request(app).post(`/api/session/`).send({
      name: 'Morning Yoga',
      date: '2024-01-15',
      description: 'A relaxing morning session',
      teacherId: teacher.id,
    });
    expect(rest.status).toBe(401);
  });
});

describe('PUT /api/session/:id', () => {
  it('should update a session and return 200 with updated session data', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .put(`/api/session/${session.id}`)
      .send({
        name: 'Updated Yoga',
        date: '2024-02-01',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return an error if sessionId is not a number', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .put(`/api/session/abc`)
      .send({
        name: 'Updated Yoga',
        date: '2024-02-01',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });

  it('should return an error if user is not admin', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .put(`/api/session/${session.id}`)
      .send({
        name: 'Updated Yoga',
        date: '2024-02-01',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(403);
  });

  it('should return an error if user is not authenticated', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const rest = await request(app).put(`/api/session/${session.id}`).send({
      name: 'Updated Yoga',
      date: '2024-02-01',
      teacherId: teacher.id,
    });
    expect(rest.status).toBe(401);
  });

  it('should return an error if the session is not found', async () => {
    const teacher = await createTeacher();

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .put(`/api/session/10`)
      .send({
        name: 'Updated Yoga',
        date: '2024-02-01',
        teacherId: teacher.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });

  it('should return an error if the teacher is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .put(`/api/session/${session.id}`)
      .send({
        name: 'Updated Yoga',
        date: '2024-02-01',
        teacherId: 10,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(rest.status).toBe(400);
  });
});

describe('DELETE /api/session/:id', () => {
  it('should delete a session and return 200 with deleted session data', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .delete(`/api/session/${session.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(rest.status).toBe(200);
  });
  it('should return an error if sessionId is not a number', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .delete(`/api/session/abc`)
      .set('Authorization', `Bearer ${token}`);

    expect(rest.status).toBe(400);
  });

  it('should return an error if user is not admin', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .delete(`/api/session/${session.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(403);
  });
  it('should return an error if user is not authenticated', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const rest = await request(app).delete(`/api/session/${session.id}`);

    expect(rest.status).toBe(401);
  });

  it('should return an error if the session is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken(true);
    const rest = await request(app)
      .delete(`/api/session/10`)
      .set('Authorization', `Bearer ${token}`);

    expect(rest.status).toBe(404);
  });
});

describe('POST /api/session/:id/participate/:userId', () => {
  it('should return 200', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/session/${session.id}/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });
  it('should return an error if sessionId is not a number', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/session/abc/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return an error if userId is not a number', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/session/${session.id}/participate/abc`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return an error if the session is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/session/10/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return an error if the user is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token } = await getAuthToken();
    const rest = await request(app)
      .post(`/api/session/${session.id}/participate/10`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return an error if the user is already participating', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );
    const rest = await request(app)
      .post(`/api/session/${session.id}/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(409);
  });
  it('should return an error if user is not authenticated', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );
    const rest = await request(app).post(
      `/api/session/${session.id}/participate/${userId}`,
    );
    expect(rest.status).toBe(401);
  });
});

describe('DELETE /api/session/:id/participate/:userId', () => {
  it('should return 200', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();

    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );

    const rest = await request(app)
      .delete(`/api/session/${session.id}/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(200);
  });

  it('should return an error if sessionId is not a number', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );
    const rest = await request(app)
      .delete(`/api/session/abc/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return an error if userId is not a number', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );
    const rest = await request(app)
      .delete(`/api/session/${session.id}/participate/abc`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(400);
  });
  it('should return an error if the session is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );
    const rest = await request(app)
      .delete(`/api/session/10/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return an error if the user is not found', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();
    const sessionParticipation = await createSessionParticipation(
      session.id,
      userId,
    );
    const rest = await request(app)
      .delete(`/api/session/${session.id}/participate/10`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });
  it('should return an error if the user is not already participating', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { token, userId } = await getAuthToken();

    const rest = await request(app)
      .delete(`/api/session/${session.id}/participate/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(rest.status).toBe(404);
  });

  it('should return an error if user is not authenticated', async () => {
    const teacher = await createTeacher();
    const session = await createSession(teacher.id);

    const { userId } = await getAuthToken();

    const rest = await request(app).delete(
      `/api/session/${session.id}/participate/${userId}`,
    );
    expect(rest.status).toBe(401);
  });
});
