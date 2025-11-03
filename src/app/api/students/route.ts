// src/app/api/students/route.ts
import { NextRequest } from 'next/server';
import { getStudentsDb, addStudentDb } from '@/db/studentDb';

export async function GET() {
  try {
    const students = await getStudentsDb();
    return Response.json(students);
  } catch (error) {
    console.error('GET students error:', error);
    return Response.json({ message: 'Ошибка при загрузке студентов' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, middleName, groupId } = body;

    if (!firstName || !lastName || groupId == null) {
      return Response.json(
        { message: 'firstName, lastName и groupId обязательны' },
        { status: 400 }
      );
    }

    const newStudent = await addStudentDb({
      
      firstName,
      lastName,
      middleName,
      contacts: '',
      groupId: Number(groupId),
    });

    return Response.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error('POST student error:', error);
    return Response.json(
      { message: error.message || 'Не удалось создать студента' },
      { status: 400 }
    );
  }
}