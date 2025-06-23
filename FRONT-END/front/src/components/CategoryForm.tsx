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
} from '@mui/material';
import api from '@/services/api';
import { Category } from '@/types/interfaces';

interface CategoryFormProps {
  categoryId?: number; // Opcional, para indicar que é uma edição
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (categoryId) {
      // Se tiver categoryId, é modo de edição, então busca os dados
      const fetchCategory = async () => {
        setLoading(true);
        try {
          const response = await api.get<Category>(`/category/${categoryId}`);
          setName(response.data.name);
          setDescription(response.data.description);
        } catch (err: any) {
          console.error("Erro ao buscar categoria:", err);
          setError(err.response?.data?.mensagem || "Erro ao carregar categoria.");
          router.push('/categories'); // Redireciona se não encontrar ou sem permissão
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [categoryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (categoryId) {
        // Edição
        await api.put(`/category/${categoryId}`, { name, description });
        setSuccess('Categoria atualizada com sucesso!');
      } else {
        // Criação
        await api.post('/category', { name, description });
        setSuccess('Categoria cadastrada com sucesso!');
        setName('');
        setDescription('');
      }
      setTimeout(() => {
        router.push('/categories'); // Redireciona para a lista após sucesso
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao salvar categoria:", err);
      setError(err.response?.data?.mensagem || "Erro ao salvar categoria. Verifique o nome.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && categoryId) { // Apenas mostra loading na edição enquanto busca os dados
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
            {categoryId ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome da Categoria"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (categoryId ? 'Salvar Alterações' : 'Cadastrar Categoria')}
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