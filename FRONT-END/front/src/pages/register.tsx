import RegisterForm from '../components/RegisterForm';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';

export default function RegisterPage() {
  return <RegisterForm />;
}

// Opcional: Se já estiver logado, redireciona da página de registro
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/', // Redireciona para a home se já estiver logado
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}