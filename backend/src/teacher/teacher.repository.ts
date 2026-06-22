import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findAllTeachers() {
  return await prisma.teacher.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function findById(id: number) {
  return await prisma.teacher.findUnique({
    where: { id },
  });
}
