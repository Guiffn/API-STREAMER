import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
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
import AddIcon from '@mui/icons-material/Add';
import api from '@/services/api';
import { Category } from '@/types/interfaces';
import { useRouter } from 'next/router';

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      if (status === 'authenticated' && session?.user?.permission === 'Admin') {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get('/category');
          setCategories(response.data as Category[]);
        } catch (err: any) {
          console.error("Erro ao buscar categorias:", err);
          setError(err.response?.data?.mensagem || "Erro ao carregar categorias.");
          if (err.response?.status === 401 || err.response?.status === 403) {
            router.push('/'); // Redireciona para home ou login se não tiver permissão ou token expirado
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategories();
  }, [session, status, router]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await api.delete(`/category/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (err: any) {
        console.error("Erro ao deletar categoria:", err);
        setError(err.response?.data?.mensagem || "Erro ao deletar categoria.");
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
        Gerenciamento de Categorias
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} href="/categories/new" startIcon={<AddIcon />}>
        Adicionar Nova Categoria
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell component="th" scope="row">
                  {category.id}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" href={`/categories/edit/${category.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(category.id)}>
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