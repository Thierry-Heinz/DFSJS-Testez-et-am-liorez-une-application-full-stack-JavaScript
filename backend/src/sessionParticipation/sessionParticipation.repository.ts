import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createSessionparticipation(
  sessionId: number,
  userId: number,
) {
  return await prisma.sessionParticipation.create({
    data: {
      sessionId,
      userId: userId,
    },
  });
}

export async function findSessionParticipationById(
  sessionId: number,
  userId: number,
) {
  return await prisma.sessionParticipation.findUnique({
    where: {
      sessionId_userId: {
        sessionId,
        userId: userId,
      },
    },
  });
}

export async function deleteSessionParticipationById(
  sessionId: number,
  userId: number,
) {
  return await prisma.sessionParticipation.delete({
    where: {
      sessionId_userId: {
        sessionId,
        userId: userId,
      },
    },
  });
}
