import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { login, register } from '../auth/auth.controller';
import {
  deleteUserById,
  getUserById,
  promoteUserToAdmin,
} from '../user/user.controller';
import { getAllTeachers, getTeacherById } from '../teacher/teacher.controller';
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  participate,
  unparticipate,
} from '../session/session.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Auth routes (public)
router.post('/api/auth/login', asyncHandler(login));
router.post('/api/auth/register', asyncHandler(register));

// Session routes (protected)
router.get('/api/session', authMiddleware, asyncHandler(getAllSessions));

router.get('/api/session/:id', authMiddleware, asyncHandler(getSessionById));

router.post('/api/session', authMiddleware, asyncHandler(createSession));
router.put('/api/session/:id', authMiddleware, asyncHandler(updateSession));
router.delete('/api/session/:id', authMiddleware, asyncHandler(deleteSession));
router.post(
  '/api/session/:id/participate/:userId',
  authMiddleware,
  asyncHandler(participate),
);
router.delete(
  '/api/session/:id/participate/:userId',
  authMiddleware,
  asyncHandler(unparticipate),
);

// Teacher routes (protected)
router.get('/api/teacher', authMiddleware, asyncHandler(getAllTeachers));
router.get('/api/teacher/:id', authMiddleware, asyncHandler(getTeacherById));

// User routes (protected)
router.get('/api/user/:id', authMiddleware, asyncHandler(getUserById));
(router.post(
  '/api/user/promote-admin',
  authMiddleware,
  asyncHandler(promoteUserToAdmin),
),
  router.delete('/api/user/:id', authMiddleware, asyncHandler(deleteUserById)));

export default router;
