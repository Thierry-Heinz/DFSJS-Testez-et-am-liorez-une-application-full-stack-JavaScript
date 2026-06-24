import { CreateUserDto, UserDto } from './dto/user.dto';
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUserById,
} from './user.repository';

export async function createUserService(createUserDto: CreateUserDto) {
  return await createUser(createUserDto);
}

export async function getUserByIdService(id: number): Promise<UserDto | null> {
  return await findUserById(id);
}
export async function getUserByEMailService(
  email: string,
): Promise<UserDto | null> {
  return await findUserByEmail(email);
}

export async function updateUserByIdService(
  id: number,
  { admin }: { admin: boolean },
) {
  return await updateUserById(id, { admin });
}

export async function deleteUserByIdService(id: number) {
  return await deleteUserById(id);
}
