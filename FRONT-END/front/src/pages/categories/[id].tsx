import CategoryForm from '../../components/CategoryForm';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { Box, Alert } from '@mui/material';
import { useRouter } from 'next/router';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const categoryId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  if (categoryId === undefined) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        ID da categoria inválido.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <CategoryForm categoryId={categoryId} />
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