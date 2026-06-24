import { TeacherDto } from './dto/teacher.dto';
import { findAllTeachers, findTeacherById } from './teacher.repository';

export async function getallTeachersService() {
  return await findAllTeachers();
}

export async function getTeacherByIdService(
  id: number,
): Promise<TeacherDto | null> {
  return await findTeacherById(id);
}
