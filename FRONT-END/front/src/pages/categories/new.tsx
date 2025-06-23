import CategoryForm from '../../components/CategoryForm';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { Box, Alert } from '@mui/material';

export default function NewCategoryPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <CategoryForm />
    </Box>
  );
}

// Protege a rota no servidor
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || session.user?.permission !== 'Admin') {
    return {
      redirect: {
        destination: '/', // Redireciona para a home se não for admin
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}