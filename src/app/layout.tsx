import { dehydrate } from '@tanstack/react-query';

import TanStackQuery from '@/containers/TanStackQuery';
import queryClient from '@/api/reactQueryClient';
import { getGroupsApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Main from '@/components/layout/Main/Main';

import type { Metadata } from 'next';

import '@/styles/globals.scss';
import StudentInterface from '@/types/StudentInterface';
import { getStudentsApi } from '@/api/studentsApi';

export const metadata: Metadata = {
  title: 'Вэб разработка ВКИ - Next.js шаблон',
  description: 'Шаблон для веб-разработки с использованием Next.js, React Hook Form, Yup, SCSS, Eslint, TanStack Query (React Query)',
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> => {
  let groups: GroupInterface[];

  // выполняется на сервере - загрузка групп
  await queryClient.prefetchQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      groups = await getGroupsApi();
      console.log('Groups', groups);
      return groups;
    },
  });



    let Students: StudentInterface[];

  // выполняется на сервере - загрузка групп
  await queryClient.prefetchQuery({
    queryKey: ['students'],
    queryFn: async () => {
      Students = await getStudentsApi();
      console.log('Students', Students);
      return Students;
    },
  });

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  return (
    <TanStackQuery state={state}>
      <html lang="ru">
        <body>
          <Header />
          <Main>
            <>{children}</>
          </Main>
          <Footer />
        </body>
      </html>
    </TanStackQuery>
  );
};

export default RootLayout;
