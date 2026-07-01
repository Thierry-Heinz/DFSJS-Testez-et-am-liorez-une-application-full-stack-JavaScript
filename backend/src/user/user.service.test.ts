import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockCreateUserDto, mockUser } from '../tests/fixtures';

vi.mock('./user.repository', () => ({
  createUser: vi.fn(),
  findUserById: vi.fn(),
  findUserByEmail: vi.fn(),
  updateUserById: vi.fn(),
  deleteUserById: vi.fn(),
}));

import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUserById,
} from './user.repository';
import {
  createUserService,
  deleteUserByIdService,
  getUserByEMailService,
  getUserByIdService,
  updateUserByIdService,
} from './user.service';

describe('Test ==> user.service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const errorMessage = 'Database error';

  it('should create and return user', async () => {
    vi.mocked(createUser).mockResolvedValue(mockUser);
    await expect(createUserService(mockCreateUserDto)).resolves.toEqual(
      mockUser,
    );
  });

  it('should return error if creation fails', async () => {
    vi.mocked(createUser).mockRejectedValue(new Error(errorMessage));
    await expect(createUserService(mockCreateUserDto)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should return user by id', async () => {
    vi.mocked(findUserById).mockResolvedValue(mockUser);
    await expect(getUserByIdService(1)).resolves.toEqual(mockUser);
  });

  it('should return error if findUserById fails', async () => {
    vi.mocked(findUserById).mockRejectedValue(new Error(errorMessage));
    await expect(getUserByIdService(1)).rejects.toThrow(errorMessage);
  });

  it('should return undefined if the id does not match a user', async () => {
    vi.mocked(findUserById).mockResolvedValue(null);
    const session = await getUserByIdService(18);
    expect(session).toBeNull();
  });

  it('should return user by email', async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(mockUser);
    await expect(getUserByEMailService(mockUser.email)).resolves.toEqual(
      mockUser,
    );
  });

  it('should return error if findUserByEmail fails', async () => {
    vi.mocked(findUserByEmail).mockRejectedValue(new Error(errorMessage));
    await expect(getUserByEMailService(mockUser.email)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should update user by id', async () => {
    vi.mocked(updateUserById).mockResolvedValue({ ...mockUser, admin: true });
    await expect(updateUserByIdService(1, { admin: true })).resolves.toEqual({
      ...mockUser,
      admin: true,
    });
  });

  it('should return error if updateUserById fails', async () => {
    vi.mocked(updateUserById).mockRejectedValue(new Error(errorMessage));
    await expect(updateUserByIdService(1, { admin: true })).rejects.toThrow(
      errorMessage,
    );
  });

  it('should delete user by id', async () => {
    vi.mocked(deleteUserById).mockResolvedValue(mockUser);
    expect(await deleteUserByIdService(1)).toEqual(mockUser);
  });

  it('should return error if deleteUserById fails', async () => {
    vi.mocked(deleteUserById).mockRejectedValue(new Error(errorMessage));
    await expect(deleteUserByIdService(1)).rejects.toThrow(errorMessage);
  });
});
