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

export async function updateUser(id: number, updateUserDto: UpdateUserDto) {
  return await prisma.user.update({
    where: { id: id },
    data: updateUserDto,
  });
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}
