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

// Permissão vem com URL padrão do .NET
type TokenPayload = {
  [key: string]: any;
};

type UsuarioUpdate = {
  name?: string;
  email?: string;
  password?: string;
};

export default function UsuarioEditar() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    const dados: UsuarioUpdate = {};
    if (nome) dados.name = nome;
    if (email) dados.email = email;
    if (senha) dados.password = senha;

    try {
      await api.put(`/users/${id}`, dados);
      setMensagem("Usuário atualizado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setId("");
    } catch (err: any) {
      setErro("Erro ao atualizar usuário.");
      console.error("Erro ao atualizar:", err);
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
        <Alert severity="error">Você não tem permissão para acessar esta página.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={10} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Alterar Usuário
        </Typography>
        {mensagem && <Alert severity="success">{mensagem}</Alert>}
        {erro && <Alert severity="error">{erro}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="ID do Usuário"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Novo Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />
          <TextField
            label="Novo E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Nova Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Atualizar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}