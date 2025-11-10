'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import AddStudent from './AddStudent/AddStudent';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();

  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      debugger;
      console.log('OnDeleteHandler',studentId);

      deleteStudentMutate(studentId);
    }
  };


  /**
   * Добавление студента — обработчик события нажатия "добавить"
   * @param studentFormField Форма студента
   */
const handleAddStudent = (values: { firstName: string; lastName: string; middleName: string; groupId: number }): void => {
    debugger;
    console.log('Добавление студента', values);

     addStudentMutate({ ...values });
  };

  return (
    <div className={styles.Students}>
      <AddStudent onSubmit={handleAddStudent} />
      {students.map((student) => (
        <Student key={student.id} 
        student={student} 
        onDelete={onDeleteHandler} />
      ))}
    </div>
  );
};


export default Students;

