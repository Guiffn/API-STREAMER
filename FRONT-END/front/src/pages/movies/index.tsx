import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from '@/services/api';
import { Movie } from '@/types/interfaces';
import { useRouter } from 'next/router';

export default function MoviesPage() {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      if (status === 'authenticated') {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get('/movie'); // Requisição para listar filmes do usuário
          setMovies(response.data as Movie[]);
        } catch (err: any) {
          console.error("Erro ao buscar filmes:", err);
          setError(err.response?.data?.mensagem || "Erro ao carregar filmes.");
          if (err.response?.status === 401 || err.response?.status === 403) {
            router.push('/login'); // Redireciona para login se o token expirar ou for inválido
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMovies();
  }, [status, router]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este filme?')) {
      try {
        await api.delete(`/movie/${id}`);
        setMovies(movies.filter((movie) => movie.id !== id));
      } catch (err: any) {
        console.error("Erro ao deletar filme:", err);
        setError(err.response?.data?.mensagem || "Erro ao deletar filme.");
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (movies.length === 0) {
    return (
      <Typography variant="h6" sx={{ mt: 4 }}>
        Você não possui filmes cadastrados. Adicione um novo!
        <Button variant="contained" color="primary" sx={{ ml: 2 }} href="/movies/new">
          Adicionar Novo Filme
        </Button>
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Filmes
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} href="/movies/new" startIcon={<AddIcon />}>
        Adicionar Novo Filme
      </Button>
      <List>
        {movies.map((movie) => (
          <ListItem
            key={movie.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" href={`/movies/edit/${movie.id}`}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(movie.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={movie.title}
              // secondary={`Categoria ID: ${movie.categoryId}`} // Se o backend retornar o nome da categoria no Movie, você pode exibir aqui
              secondary={`ID do filme: ${movie.id}`} // Placeholder, ajuste conforme a resposta da API
            />
          </ListItem>
        ))}
      </List>
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