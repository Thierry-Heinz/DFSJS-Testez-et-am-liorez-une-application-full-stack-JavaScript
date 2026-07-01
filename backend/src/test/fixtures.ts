import { SessionParticipationDto } from '../sessionParticipation/dto/sessionParticipation.dto';
import { TeacherDto } from '../teacher/dto/teacher.dto';
import { UserDto } from '../user/dto/user.dto';

export const mockUser: UserDto = {
  id: 1,
  email: 'user1@test.com',
  firstName: 'Alice',
  lastName: 'Dupont',
  password: 'hashedpassword1',
  admin: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockTeacher: TeacherDto = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockParticipants: SessionParticipationDto[] = [
  { sessionId: 1, userId: 1, user: mockUser },
  {
    sessionId: 1,
    userId: 2,
    user: { ...mockUser, id: 2, email: 'user2@test.com' },
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
