import api from './api';
import { describe, expect, it } from 'vitest';
import { authService } from './auth.service';

vi.mock('./api');

const loginData = {
  token: 'fake-token',
  id: 1,
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
  admin: false,
};

const login = { email: 'test@test.com', password: '123' };

// Login
describe('Test ==> auth.service login', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("don't set token and user data...", async () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(api.post).mockRejectedValue(new Error(errorMessage));

    await expect(authService.login(login)).rejects.toThrow(errorMessage);

    expect(localStorage.getItem('token')).toBeFalsy();
    expect(localStorage.getItem('user')).toBeFalsy();
  });

  it('set token and user data to the local storage', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: loginData });

    await authService.login(login);

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(loginData));
  });

  it('return user data', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: loginData });

    const response = await authService.login(login);

    expect(response).toEqual(loginData);
  });
});

const registerData = {
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
  password: 'test!1234',
};

//Register
describe('Test ==> auth.service register', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("don't set token and user data...", async () => {
    const errorMessage = 'Email already exists';
    vi.mocked(api.post).mockRejectedValue(new Error(errorMessage));

    await expect(authService.register(registerData)).rejects.toThrow(
      errorMessage,
    );

    expect(localStorage.getItem('token')).toBeFalsy();
    expect(localStorage.getItem('user')).toBeFalsy();
  });

  it('set token and user data to the local storage', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: loginData });

    await authService.register(registerData);

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(loginData));
  });

  it('return user data', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: loginData });

    const response = await authService.register(registerData);

    expect(response).toEqual(loginData);
  });
});

//Logout
describe('Test ==> auth.service logout', () => {
  it('remove token and user data from local storage', () => {
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('user', JSON.stringify(loginData));

    authService.logout();

    expect(localStorage.getItem('token')).toBeFalsy();
    expect(localStorage.getItem('user')).toBeFalsy();
  });
});

//getCurrentUser
describe('Test ==> auth.service getCurrentUser', () => {
  afterEach(() => {
    localStorage.clear();
  });
  it('get user data from local storage', () => {
    localStorage.setItem('user', JSON.stringify(loginData));

    authService.getCurrentUser();

    expect(localStorage.getItem('user')).toEqual(JSON.stringify(loginData));
  });
  it('return null if no user data is found in local storage', () => {
    authService.getCurrentUser();

    expect(localStorage.getItem('user')).toBeFalsy();
  });
});

//updaTeCurrentUser
describe('Test ==> auth.service updaTeCurrentUser', () => {
  afterEach(() => {
    localStorage.clear();
  });
  it('get user data from local storage', () => {
    localStorage.setItem('user', JSON.stringify(loginData));

    authService.updateCurrentUser({ admin: true });

    loginData.admin = true;

    expect(localStorage.getItem('user')).toEqual(JSON.stringify(loginData));
  });
  it('return null if no user data is found in local storage', () => {
    authService.updateCurrentUser({ admin: true });

    expect(localStorage.getItem('user')).toBeFalsy();
  });
});

//getToken
describe('Test ==> auth.service getToken', () => {
  afterEach(() => {
    localStorage.clear();
  });
  it('get token from local storage', () => {
    localStorage.setItem('token', loginData.token);
    authService.getToken();
    expect(localStorage.getItem('token')).toEqual(loginData.token);
  });
  it('return null if no token is found in local storage', () => {
    authService.getToken();
    expect(localStorage.getItem('token')).toBeFalsy();
  });
});

//isAuthenticated
describe('Test ==> auth.service isAuthenticated', () => {
  afterEach(() => {
    localStorage.clear();
  });
  it('get token from local storage', () => {
    localStorage.setItem('token', loginData.token);
    authService.isAuthenticated();
    expect(localStorage.getItem('token')).toBeTruthy();
  });
  it('return null if no token is found in local storage', () => {
    authService.isAuthenticated();
    expect(localStorage.getItem('token')).toBeFalsy();
  });
});
