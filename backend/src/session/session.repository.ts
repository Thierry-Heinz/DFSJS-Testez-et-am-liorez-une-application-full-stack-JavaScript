import { PrismaClient } from '@prisma/client';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';

const prisma = new PrismaClient();

export async function createSession(createSessionDto: CreateSessionDto) {
  return await prisma.session.create({
    data: createSessionDto,
    include: {
      teacher: true,
      participants: true,
    },
  });
}

export async function findAllSessions() {
  return await prisma.session.findMany({
    include: {
      teacher: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function findSessionById(id: number) {
  return await prisma.session.findUnique({
    where: { id },
    include: {
      teacher: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function updateSession(
  id: number,
  updateSessionDto: UpdateSessionDto,
) {
  return await prisma.session.update({
    where: { id },
    data: updateSessionDto,
    include: {
      teacher: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function deleteSessionById(id: number) {
  return await await prisma.session.delete({
    where: { id },
  });
}
