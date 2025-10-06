'use client';

import { useForm } from 'react-hook-form';
import styles from './AddStudent.module.scss';
import useGroups from '@/hooks/useGroups';
interface AddStudentFormValues {
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: number;
}

interface Props {
  onAdd: (data: AddStudentFormValues) => void;
}

const AddStudent = ({ onAdd }: Props): React.ReactElement => {
  const { groups } = useGroups(); 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStudentFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      groupId: groups.length > 0 ? groups[0].id : 0,
    },
  });

  const onSubmit = (data: AddStudentFormValues) => {
    onAdd(data);
    reset(); 
  };

  return (
    <form className={styles.AddStudent} onSubmit={handleSubmit(onSubmit)}>
      <h3>Добавить студента</h3>
      <div>
        <input
          {...register('lastName', { required: 'Фамилия обязательна' })}
          placeholder="Фамилия"
        />
        {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
      </div>
      <div>
        <input
          {...register('firstName', { required: 'Имя обязательно' })}
          placeholder="Имя"
        />
        {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
      </div>
      <div>
        <input
          {...register('middleName')}
          placeholder="Отчество (необязательно)"
        />
      </div>
      <div>
        <label>Группа:</label>
        <select
          {...register('groupId', { valueAsNumber: true, required: 'Выберите группу' })}
          className={styles.select}
        >
          {groups.length === 0 ? (
            <option value="">Нет доступных групп</option>
          ) : (
            groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))
          )}
        </select>
        {errors.groupId && <span className={styles.error}>{errors.groupId.message}</span>}
      </div>

      <button type="submit" disabled={groups.length === 0}>
        {groups.length === 0 ? 'Нет групп' : 'Добавить'}
      </button>
    </form>
  );
};

export default AddStudent;