import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createUser() {}

export async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}
