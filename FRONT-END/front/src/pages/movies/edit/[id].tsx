import MovieForm from '@/components/MovieForm'; 
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { Box, Alert } from '@mui/material';
import { useRouter } from 'next/router';

export default function EditMoviePage() {
  const router = useRouter();
  const { id } = router.query;
  const movieId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  if (movieId === undefined) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        ID do filme inválido.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <MovieForm movieId={movieId} />
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