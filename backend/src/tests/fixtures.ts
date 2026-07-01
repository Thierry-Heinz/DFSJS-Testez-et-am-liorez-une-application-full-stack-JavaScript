import { SessionParticipationDto } from '../sessionParticipation/dto/sessionParticipation.dto';
import { TeacherDto } from '../teacher/dto/teacher.dto';
import { UserDto } from '../user/dto/user.dto';

export const mockRegisterData = {
  email: 'test@test1.com',
  password: 'test!1234',
  firstName: 'test',
  lastName: 'test',
};

export const login = { email: 'user1@test.com', password: 'password1' };
export const password = '123';

export const token = 'fake-token';

export const mockCreateUserDto = {
  email: 'user1@test.com',
  firstName: 'Alice',
  lastName: 'Dupont',
  password: 'password1',
  admin: false,
};

export const mockUser = {
  email: 'user1@test.com',
  firstName: 'Alice',
  lastName: 'Dupont',
  admin: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUserDto = {
  ...mockUser,
  password: 'hashedpassword1',
};

export const mockTeacher = {
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockParticipants: SessionParticipationDto[] = [
  { sessionId: 1, userId: 1, user: { ...mockUserDto, id: 1 } },
  {
    sessionId: 1,
    userId: 2,
    user: { ...mockUserDto, id: 2, email: 'user2@test.com' },
  },
];

export const mockRawSession = {
  id: 1,
  name: 'Morning Yoga',
  date: new Date('2024-01-15'),
  description: 'A relaxing morning session',
  teacherId: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  teacher: mockTeacher,
  participants: mockParticipants,
};

export const mockRawSessions = [
  mockRawSession,
  {
    ...mockRawSession,
    id: 2,
    name: 'Evening Yoga',
    date: new Date('2024-01-16'),
  },
];

export const mockAdaptedSession = {
  id: 1,
  name: 'Morning Yoga',
  date: new Date('2024-01-15'),
  description: 'A relaxing morning session',
  teacherId: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  teacher: mockTeacher,
  users: [1, 2],
};

export const mockAdaptedSessions = [
  mockAdaptedSession,
  {
    ...mockAdaptedSession,
    id: 2,
    name: 'Evening Yoga',
    date: new Date('2024-01-16'),
  },
];

export const mockCreateSessionDto = {
  name: 'Morning Yoga',
  date: new Date('2024-01-15'),
  description: 'A relaxing morning session',
  teacherId: 1,
};

export const mockUpdateSessionDto = {
  name: 'Updated Yoga',
  date: new Date('2024-02-01'),
};

export const mockSessionParticipationDto = {
  sessionId: 1,
  userId: 1,
};

export const mockSessionParticipation = {
  sessionId: 1,
  userId: 1,
  user: mockUser,
};

export const mockSessionParticipations = [
  mockSessionParticipation,
  {
    sessionId: 1,
    userId: 2,
    user: { ...mockUser, id: 2, email: 'user2@test.com' },
  },
];

export const mockRawTeacher = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockRawTeachers = [
  mockRawTeacher,
  {
    ...mockRawTeacher,
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
  },
];
