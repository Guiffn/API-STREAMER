'use client';

import * as React from 'react'; // Import React
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import api from '@/services/api'; // Importa a instância do axios configurada

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // More specific event type
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/users', { name, email, password, permission: 0 });
      setSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao registrar:", err);
      setError(err.response?.data?.mensagem || 'Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Cadastro
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
              // Add explicit type for the event object 'e'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              // Add explicit type for the event object 'e'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={password}
              // Add explicit type for the event object 'e'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Cadastrar
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" passHref>
                Já tem uma conta? Faça login
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}