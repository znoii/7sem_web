'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import AddStudent from './Student/AddStudent/AddStudent';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();

  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      deleteStudentMutate(studentId);
    }
  };

  return (
    <div className={styles.Students}>
      <AddStudent onAdd={addStudentMutate} />
      {students.map((student) => (
        <Student key={student.id} student={student} onDelete={onDeleteHandler} />
      ))}
    </div>
  );
};

export default Students;
