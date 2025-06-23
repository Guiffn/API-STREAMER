import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import type { Session } from 'next-auth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '@/services/api';
import { User } from '@/types/interfaces';

export default function UserEditPage() {
  const router = useRouter();
  const { id } = router.query; // Pega o ID da URL
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Campo de senha para atualização
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (id) { // Certifica-se de que o ID está disponível
        try {
          setLoading(true);
          setError(null);
          const response = await api.get(`/users/${id}`);
          const userData = response.data as User;
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
        } catch (err: any) {
          console.error("Erro ao buscar usuário:", err);
          setError(err.response?.data?.mensagem || "Erro ao carregar usuário.");
          if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404) {
            router.push('/users'); // Redireciona se não for encontrado ou sem permissão
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updateData: { name: string; email: string; password?: string } = { name, email };
      if (password) { // Adiciona a senha apenas se o campo foi preenchido
        updateData.password = password;
      }
      await api.put(`/users/${id}`, updateData);
      setSuccess('Usuário atualizado com sucesso!');
      // Opcional: redirecionar de volta para a lista ou home
      setTimeout(() => {
        router.push('/users');
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.response?.data?.mensagem || "Erro ao atualizar usuário.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Usuário não encontrado.
      </Alert>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Editar Usuário: {user.name}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Nova Senha (deixe em branco para não alterar)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Salvar Alterações
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

// Protege a rota no servidor, garantindo que apenas admins (ou o próprio usuário) possam pré-renderizar
export async function getServerSideProps(context: GetServerSidePropsContext) {
  interface SessionUserWithId {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    permission?: string | null;
    id?: number | string | null;
  }
  const session = await getSession(context) as (Session & { user?: SessionUserWithId });
  const { id } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Permite que o próprio usuário edite seu perfil OU que um admin edite qualquer perfil
  if (session.user?.permission !== 'Admin' && session.user?.id !== Number(id)) {
    return {
      redirect: {
        destination: '/', // Redireciona para a home se não tiver permissão
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}