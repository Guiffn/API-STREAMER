"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "@/app/Services/api";

type Usuario = {
  id: number;
  name: string;
  email: string;
  permission: string;
};

export default function UsuarioAutenticado() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get<Usuario>("/auth/me")
      .then((res) => {
        setUsuario(res.data);
      })
      .catch((err) => {
        setErro("Erro ao obter dados do usuário autenticado.");
        console.error("Erro:", err);
      })
      .finally(() => setCarregando(false));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={10} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dados do Usuário Autenticado
        </Typography>

        {carregando && <CircularProgress />}
        {erro && <Alert severity="error">{erro}</Alert>}

        {usuario && (
          <Box sx={{ mt: 2 }}>
            <Typography><strong>ID:</strong> {usuario.id}</Typography>
            <Typography><strong>Nome:</strong> {usuario.name}</Typography>
            <Typography><strong>Email:</strong> {usuario.email}</Typography>
            <Typography><strong>Permissão:</strong> {usuario.permission}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}