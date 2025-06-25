"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "@/app/Services/api";
import { jwtDecode } from "jwt-decode";

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
    // Sua lógica de permissão existente...
    setCarregando(false);
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

  // Lógica de carregamento e permissão...

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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Alterar Usuário
        </Typography>
        {mensagem && <Alert severity="success" sx={{ mb: 2 }}>{mensagem}</Alert>}
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
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
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' } }}
          />
          <TextField
            label="Novo Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' } }}
          />
          <TextField
            label="Novo E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' } }}
          />
          <TextField
            label="Nova Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' } }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#e50914",
              "&:hover": { backgroundColor: "#f40612" },
            }}
          >
            Atualizar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}