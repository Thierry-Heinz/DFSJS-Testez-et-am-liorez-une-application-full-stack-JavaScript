import api from './api';
import { describe, expect, it } from 'vitest';
import { authService } from './auth.service';
vi.mock('./api');

describe('Test ==> auth.service', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('set token and user data to the local storage', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        token: 'fake-token',
        id: 1,
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
        admin: false,
      },
    });

    await authService.login({ email: 'test@test.com', password: '123' });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe(
      JSON.stringify({
        token: 'fake-token',
        id: 1,
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
        admin: false,
      }),
    );
  });
});
