// Caminho: guiffn/api-streamer/API-STREAMER-592cbf7b39e2e48155e3eb671b2a5a772d1ca945/FRONT-END/front/src/components/MovieForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import api from '@/services/api';
import { Movie, Category } from '@/types/interfaces';

interface MovieFormProps {
  movieId?: number; // Opcional, para indicar que é uma edição
}

export default function MovieForm({ movieId }: MovieFormProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Buscar categorias para o Select
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/category');
        setCategories(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar categorias:", err);
        setError(err.response?.data?.mensagem || "Erro ao carregar categorias.");
      }
    };
    fetchCategories();

    // Se tiver movieId, buscar dados do filme para edição
    if (movieId) {
      const fetchMovie = async () => {
        setLoading(true);
        try {
          const response = await api.get<Movie>(`/movie/${movieId}`);
          setTitle(response.data.title);
          setCategoryId(response.data.categoryId);
        } catch (err: any) {
          console.error("Erro ao buscar filme:", err);
          setError(err.response?.data?.mensagem || "Erro ao carregar filme.");
          router.push('/movies'); // Redireciona se não encontrar ou sem permissão
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }
  }, [movieId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (categoryId === '') {
        setError('Por favor, selecione uma categoria.');
        setLoading(false);
        return;
    }

    try {
      if (movieId) {
        // Edição
        await api.put(`/movie/${movieId}`, { title, categoryId: categoryId.toString() }); // categoryId como string para o DTO
        setSuccess('Filme atualizado com sucesso!');
      } else {
        // Criação
        await api.post('/movie', { title, categoryId: categoryId });
        setSuccess('Filme cadastrado com sucesso!');
        setTitle('');
        setCategoryId('');
      }
      setTimeout(() => {
        router.push('/movies'); // Redireciona para a lista após sucesso
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao salvar filme:", err);
      setError(err.response?.data?.mensagem || "Erro ao salvar filme. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && movieId) { // Apenas mostra loading na edição enquanto busca os dados
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            {movieId ? 'Editar Filme' : 'Cadastrar Novo Filme'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Título do Filme"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="category-select-label">Categoria</InputLabel>
              <Select
                labelId="category-select-label"
                value={categoryId}
                label="Categoria"
                onChange={(e) => setCategoryId(e.target.value as number)}
              >
                <MenuItem value="">
                  <em>Nenhuma</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (movieId ? 'Salvar Alterações' : 'Cadastrar Filme')}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}