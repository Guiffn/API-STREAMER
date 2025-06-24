"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "@/app/Services/api";
import { jwtDecode } from "jwt-decode";

type Usuario = {
  id: number;
  name: string;
  email: string;
};

type TokenPayload = {
  [key: string]: any;
};

export default function UsuarioBuscar() {
  const [id, setId] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");
  const [semPermissao, setSemPermissao] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSemPermissao(true);
      setCarregando(false);
      return;
    }

    try {
      const payload: TokenPayload = jwtDecode(token);
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role !== "Admin") {
        setSemPermissao(true);
      }
    } catch {
      setSemPermissao(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  async function buscarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setUsuario(null);

    try {
      const resposta = await api.get<Usuario>(`/users/${id}`);
      setUsuario(resposta.data);
    } catch (err: any) {
      setErro("Usuário não encontrado.");
      console.error("Erro ao buscar usuário:", err);
    }
  }

  if (carregando) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (semPermissao) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Você não tem permissão para acessar esta página.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={10} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Buscar Usuário por ID
        </Typography>
        <Box
          component="form"
          onSubmit={buscarUsuario}
          sx={{ display: "flex", gap: 2, mb: 2 }}
        >
          <TextField
            label="ID"
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Buscar
          </Button>
        </Box>

        {erro && <Alert severity="error">{erro}</Alert>}

        {usuario && (
          <Box sx={{ mt: 2 }}>
            <Typography><strong>ID:</strong> {usuario.id}</Typography>
            <Typography><strong>Nome:</strong> {usuario.name}</Typography>
            <Typography><strong>Email:</strong> {usuario.email}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}