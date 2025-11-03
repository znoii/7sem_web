import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteStudentApi, getStudentsApi, addStudentApi } from '@/api/studentsApi'; 
import type StudentInterface from '@/types/StudentInterface';

// Обновлённый интерфейс
interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  addStudentMutate: (student: Omit<StudentInterface, 'id' | 'isDeleted'>) => void; 
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    
  });
  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: number) => deleteStudentApi(studentId),
    onMutate: async (studentId) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const updatedStudents = (previousStudents ?? []).map((student) =>
        student.id === studentId ? { ...student, isDeleted: true } : student
      );
      queryClient.setQueryData(['students'], updatedStudents);
      return { previousStudents };
    },
    onError: (err, studentId, context) => {
      console.error('Delete error:', err);

      console.log('deleteStudentMutation onError', err);
      debugger;
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    onSuccess: (studentId, _variables, context) => {
      const previousStudents = context?.previousStudents ?? [];
      const updatedStudents = previousStudents.filter((s) => s.id !== studentId);

      console.log('deleteStudentMutation onSuccess', studentId);
      debugger;
      queryClient.setQueryData(['students'], updatedStudents);
    },
  });

  const addStudentMutation = useMutation({
    // вызов API создания
    mutationFn: (newStudent: Omit<StudentInterface, 'id' | 'isDeleted'>) => addStudentApi(newStudent),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса create)
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // оптимистичная мутация (обновляем данные на клиенте до API запроса delete)
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
     // TODO: add student in optimisic 
     const optimisticStudent = {
        ...newStudent,
        id: -1, 
        isDeleted: false,
      };
      const updatedStudents = [...(previousStudents ?? []), optimisticStudent];

      queryClient.setQueryData(['students'], updatedStudents);

      console.log('addStudentMutation onMutate', previousStudents, updatedStudents);
      debugger;

      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      console.error('Create error:', err);
      console.log('addStudentMutation onError', err);
      debugger;
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (studentId: number) => createStudentApi(studentId),
    onSuccess: (addedStudent) => {
      // замена оптимистичного студента на реального с правильным id
      queryClient.setQueryData<StudentInterface[]>(['students'], (old) => {
        if (!old) return [addedStudent];
        return old.map((student) =>
          student.id === -1 && student === addedStudent
            ? addedStudent
            : student
        );
      });

      console.log('addStudentMutation onSuccess', addedStudent);
      debugger;
    },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutation.mutate,
    addStudentMutate: addStudentMutation.mutate, 
  };
};

export default useStudents;