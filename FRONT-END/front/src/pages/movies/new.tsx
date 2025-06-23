import MovieForm from '../../components/MovieForm';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { Box } from '@mui/material';

export default function NewMoviePage() {
  return (
    <Box sx={{ mt: 4 }}>
      <MovieForm />
    </Box>
  );
}

// Protege a rota no servidor
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}