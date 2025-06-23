import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';

// Extend the session user type to include 'permission'
declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      permission?: string | null;
    };
  }
}
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '@/services/api'; // Importa a instância do axios configurada
import { User } from '@/types/interfaces'; // Importa a interface User
import { useRouter } from 'next/router';

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (status === 'authenticated' && session?.user?.permission === 'Admin') {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get('/users');
          setUsers(response.data as User[]);
        } catch (err: any) {
          console.error("Erro ao buscar usuários:", err);
          setError(err.response?.data?.mensagem || "Erro ao carregar usuários.");
          // Redirecionar para home ou login se não tiver permissão ou token expirado
          if (err.response?.status === 401 || err.response?.status === 403) {
            router.push('/');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [session, status, router]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err: any) {
        console.error("Erro ao deletar usuário:", err);
        setError(err.response?.data?.mensagem || "Erro ao deletar usuário.");
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (session?.user?.permission !== 'Admin') {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Você não tem permissão para acessar esta página.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Usuários
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} href="/register">
        Cadastrar Novo Usuário
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Permissão</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.permission}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" href={`/users/edit/${user.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Protege a rota no servidor, garantindo que apenas admins possam pré-renderizar
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