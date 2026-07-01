import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  getallTeachersService,
  getTeacherByIdService,
} from './teacher.service';

vi.mock('./teacher.repository', () => ({
  findAllTeachers: vi.fn(),
  findTeacherById: vi.fn(),
}));

import { findAllTeachers, findTeacherById } from './teacher.repository';
import { mockRawTeachers } from '../tests/fixtures';

describe('Test ==> teacher.service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const errorMessage = 'Database error';

  it('should return teachers', async () => {
    vi.mocked(findAllTeachers).mockResolvedValue(mockRawTeachers);
    const teachers = await getallTeachersService();
    expect(teachers).toEqual(mockRawTeachers);
  });
  it('should return error if findAllTeachers fails', async () => {
    vi.mocked(findAllTeachers).mockRejectedValue(new Error(errorMessage));
    await expect(getallTeachersService()).rejects.toThrow(errorMessage);
  });

  it('should return teacher', async () => {
    vi.mocked(findTeacherById).mockResolvedValue(mockRawTeachers[0]);
    const teacher = await getTeacherByIdService(1);
    expect(teacher).toEqual(mockRawTeachers[0]);
  });
  it('should return error if findTeacherById fails', async () => {
    vi.mocked(findTeacherById).mockRejectedValue(new Error(errorMessage));
    await expect(getTeacherByIdService(1)).rejects.toThrow(errorMessage);
  });
});
