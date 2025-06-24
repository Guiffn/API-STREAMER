"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import api from "@/app/Services/api";

// Não usamos um tipo fixo aqui pois a claim de role vem com URL
type TokenPayload = {
  [key: string]: any;
};

export default function ExcluirUsuarioAdmin() {
  const [userId, setUserId] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Você precisa estar logado.");
      setCarregando(false);
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);

      // A claim de role vem com nome completo em tokens gerados com ClaimTypes.Role
      const decodedRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setRole(decodedRole);
    } catch {
      setErro("Token inválido.");
    } finally {
      setCarregando(false);
    }
  }, []);

  async function handleExcluir() {
    setErro("");
    setSucesso("");

    if (!userId.trim()) {
      setErro("Informe o ID do usuário.");
      return;
    }

    const confirmar = confirm(`Deseja realmente excluir o usuário ID: ${userId}?`);
    if (!confirmar) return;

    try {
      await api.delete(`/users/${userId}`);
      setSucesso(`Usuário ${userId} excluído com sucesso.`);
      setUserId("");
    } catch {
      setErro("Erro ao excluir o usuário. Verifique o ID e tente novamente.");
    }
  }

  if (carregando) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Verificando permissões...</Typography>
      </Container>
    );
  }

  if (role !== "Admin") {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">Apenas administradores podem acessar esta página.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Excluir Usuário por ID
        </Typography>

        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="ID do Usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="error"
            onClick={handleExcluir}
          >
            Excluir Usuário
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}