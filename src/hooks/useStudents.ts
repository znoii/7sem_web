import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteStudentApi, getStudentsApi, createStudentApi } from '@/api/studentsApi'; // ← добавьте createStudentApi
import type StudentInterface from '@/types/StudentInterface';

// Обновлённый интерфейс
interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  addStudentMutate: (student: Omit<StudentInterface, 'id' | 'isDeleted'>) => void; // ← новое
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    // enabled: false — уберите, если хотите автоматическую загрузку
    // или оставьте, но тогда вызывайте refetch в нужном месте
  });

  // Мутация удаления (без изменений)
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

  // ✅ НОВАЯ мутация: добавление студента
  const createStudentMutation = useMutation({
    mutationFn: (newStudent: Omit<StudentInterface, 'id' | 'isDeleted'>) => createStudentApi(newStudent),
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      // Оптимистично добавляем студента с временным id (например, отрицательным)
      // или просто без id — но API должен вернуть полный объект
      // Пока не знаем id, поэтому не добавляем в список до onSuccess
      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      console.error('Create error:', err);
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    onSuccess: (createdStudent) => {
      // Добавляем нового студента в кэш
      queryClient.setQueryData<StudentInterface[]>(['students'], (old) => [
        ...(old ?? []),
        createdStudent,
      ]);
    },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutation.mutate,
    addStudentMutate: createStudentMutation.mutate, // ← экспортируем
  };
};

export default useStudents;