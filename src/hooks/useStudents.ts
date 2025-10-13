import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteStudentApi, getStudentsApi, createStudentApi } from '@/api/studentsApi'; 
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
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    onSuccess: (studentId, _variables, context) => {
      const previousStudents = context?.previousStudents ?? [];
      const updatedStudents = previousStudents.filter((s) => s.id !== studentId);
      queryClient.setQueryData(['students'], updatedStudents);
    },
  });

  const createStudentMutation = useMutation({
    // вызов API создания
    mutationFn: (newStudent: Omit<StudentInterface, 'id' | 'isDeleted'>) => createStudentApi(newStudent),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса create)
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // оптимистичная мутация (обновляем данные на клиенте до API запроса delete)
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
     // TODO: add student in optimisic 
      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      console.error('Create error:', err);
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (studentId: number) => createStudentApi(studentId),
    onSuccess: (createdStudent) => {
      queryClient.setQueryData<StudentInterface[]>(['students'], (old) => [
        ...(old ?? []),
        createdStudent,
      ]);
    },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutation.mutate,
    addStudentMutate: createStudentMutation.mutate, 
  };
};

export default useStudents;