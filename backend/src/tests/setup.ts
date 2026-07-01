import { PrismaClient } from '@prisma/client';
import { afterEach } from 'vitest';

const prisma = new PrismaClient();

afterEach(async () => {
  await prisma.sessionParticipation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();
});
