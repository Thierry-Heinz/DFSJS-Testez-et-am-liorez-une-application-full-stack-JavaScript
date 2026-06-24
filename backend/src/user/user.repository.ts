import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
const prisma = new PrismaClient();

export async function createUser(userDto: CreateUserDto) {
  const { email, password, firstName, lastName, admin } = userDto;
  return await prisma.user.create({
    data: {
      email,
      password,
      firstName,
      lastName,
      admin,
    },
  });
}

export async function updateUserById(id: number, updateUserDto: UpdateUserDto) {
  return await prisma.user.update({
    where: { id: id },
    data: updateUserDto,
  });
}

export async function deleteUserById(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
