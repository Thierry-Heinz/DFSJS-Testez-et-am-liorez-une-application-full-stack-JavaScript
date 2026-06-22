import { Router } from 'express';
import { SessionController } from '../session/session.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { login, register } from '../auth/auth.controller';
import {
  deleteUserById,
  getUserById,
  promoteUserToAdmin,
} from '../user/user.controller';
import { getAllTeachers, getTeacherById } from '../teacher/teacher.controller';

const router = Router();

// Controllers
const sessionController = new SessionController();

// Auth routes (public)
router.post('/api/auth/login', (req, res) => login(req, res));
router.post('/api/auth/register', (req, res) => register(req, res));

// Session routes (protected)
router.get('/api/session', authMiddleware, (req, res) =>
  sessionController.getAll(req, res),
);
router.get('/api/session/:id', authMiddleware, (req, res) =>
  sessionController.getById(req, res),
);
router.post('/api/session', authMiddleware, (req, res) =>
  sessionController.create(req, res),
);
router.put('/api/session/:id', authMiddleware, (req, res) =>
  sessionController.update(req, res),
);
router.delete('/api/session/:id', authMiddleware, (req, res) =>
  sessionController.delete(req, res),
);
router.post(
  '/api/session/:id/participate/:userId',
  authMiddleware,
  (req, res) => sessionController.participate(req, res),
);
router.delete(
  '/api/session/:id/participate/:userId',
  authMiddleware,
  (req, res) => sessionController.unparticipate(req, res),
);

// Teacher routes (protected)
router.get('/api/teacher', authMiddleware, (req, res) => getAllTeachers(res));
router.get('/api/teacher/:id', authMiddleware, (req, res) =>
  getTeacherById(req, res),
);

// User routes (protected)
router.get('/api/user/:id', authMiddleware, (req, res) =>
  getUserById(req, res),
);
router.post('/api/user/promote-admin', authMiddleware, (req, res) =>
  promoteUserToAdmin(req, res),
);
router.delete('/api/user/:id', authMiddleware, (req, res) =>
  deleteUserById(req, res),
);

export default router;
