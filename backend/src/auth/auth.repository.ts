import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
