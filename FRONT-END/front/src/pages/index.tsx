import { useSession, signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { Typography, Button } from '@mui/material';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <>
      <Typography variant="h4">
        Bem-vindo, {session?.user?.name}!
      </Typography>
      <Typography>
        Seu email: {session?.user?.email}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => signOut({ callbackUrl: '/login' })}
        sx={{ mt: 2 }}
      >
        Sair
      </Button>
    </>
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