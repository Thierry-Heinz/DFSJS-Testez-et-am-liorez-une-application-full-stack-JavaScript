import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../user/user.service', () => ({
  getUserByEMailService: vi.fn(),
}));

vi.mock('../utils/jwt.util', () => ({
  generateToken: vi.fn(),
}));

vi.mock('bcrypt', () => ({
  compare: vi.fn(),
}));

import { validateUser } from './auth.service';
import { getUserByEMailService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { login, mockUser, password, token } from '../tests/fixtures';

describe('Test ==> auth.service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return undefined if nos user exist', async () => {
    vi.mocked(getUserByEMailService).mockResolvedValue(null);

    const existingUser = await validateUser(login.email, login.password);

    expect(existingUser).toBeUndefined();
  });

  it('should return  Invalid Credentials if password do not match', async () => {
    vi.mocked(getUserByEMailService).mockResolvedValue({
      ...mockUser,
      password,
    });
    vi.mocked(
      bcrypt.compare as (a: string, b: string) => Promise<boolean>,
    ).mockResolvedValue(false);

    await expect(validateUser(login.email, 'test!1234')).rejects.toThrow(
      'Invalid Credentials',
    );
  });

  it('should return user if no password is provided', async () => {
    vi.mocked(getUserByEMailService).mockResolvedValue({
      ...mockUser,
      password,
    });
    vi.mocked(generateToken).mockReturnValue(token);

    const existingUser = await validateUser(login.email);

    expect(existingUser).toEqual({ ...mockUser, token });
  });

  it('should return user with token', async () => {
    vi.mocked(getUserByEMailService).mockResolvedValue({
      ...mockUser,
      password,
    });
    vi.mocked(
      bcrypt.compare as (a: string, b: string) => Promise<boolean>,
    ).mockResolvedValue(true);
    vi.mocked(generateToken).mockReturnValue(token);

    const existingUser = await validateUser(login.email, login.password);

    expect(existingUser).toEqual({ ...mockUser, token });
  });
});
