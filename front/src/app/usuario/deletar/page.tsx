"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import api from "@/app/Services/api";

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
      const decodedRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
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
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#e50914' }} />
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
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
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
            required
            type="number"
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' } }}
          />

          <Button
            variant="contained"
            onClick={handleExcluir}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#e50914",
              "&:hover": { backgroundColor: "#f40612" },
            }}
          >
            Excluir Usuário
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
