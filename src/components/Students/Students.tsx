'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';

const Students = (): React.ReactElement => {
  const { Students } = useStudents();

  return (
    <div className={styles.Students}>
      <h1>Students</h1>
      {Students.map((student: StudentInterface) => (
        
        <h2 key={student.id} >
          {`${student.first_name} ${student.last_name} ${student.middle_name} ${student.groupId}`}
        </h2>
      ))}
    </div>
  );
};

export default Students;
