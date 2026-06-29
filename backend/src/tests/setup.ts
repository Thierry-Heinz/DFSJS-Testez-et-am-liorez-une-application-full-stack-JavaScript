import { PrismaClient } from '@prisma/client';
import { afterEach } from 'vitest';

const prisma = new PrismaClient();

afterEach(async () => {
  await prisma.user.deleteMany();
});
