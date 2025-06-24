"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function UsuarioCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function cadastrarUsuario(e: React.FormEvent) {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:5169/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nome, email, password: senha }),
      });

      if (!resposta.ok) {
        const data = await resposta.json();
        setErro(data.mensagem || "Erro ao cadastrar usuário");
        return;
      }

      // Cadastro bem-sucedido
      setNome("");
      setEmail("");
      setSenha("");
      setErro("");
      router.push("/usuario/login");
    } catch (err) {
      setErro("Erro na conexão com o servidor");
      console.error("Erro ao cadastrar usuário:", err);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Cadastrar Usuário
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}
        <Box component="form" onSubmit={cadastrarUsuario}>
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Cadastrar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}