"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
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
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
      }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderRadius: 2,
          color: "#fff",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Meu Perfil
        </Typography>

        {carregando && <CircularProgress sx={{ color: '#e50914' }} />}
        {erro && <Alert severity="error">{erro}</Alert>}

        {usuario && (
          <Box sx={{ mt: 2, wordBreak: 'break-word' }}>
            <Typography sx={{ mb: 1 }}><strong style={{ color: '#e50914' }}>ID:</strong> {usuario.id}</Typography>
            <Typography sx={{ mb: 1 }}><strong style={{ color: '#e50914' }}>Nome:</strong> {usuario.name}</Typography>
            <Typography sx={{ mb: 1 }}><strong style={{ color: '#e50914' }}>Email:</strong> {usuario.email}</Typography>
            <Typography><strong style={{ color: '#e50914' }}>Permissão:</strong> {usuario.permission}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}