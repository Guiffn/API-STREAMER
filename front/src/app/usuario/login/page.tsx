"use client";

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
import React, { useState } from "react";
import api from "@/app/Services/api";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "next/navigation";


type PayloadToken = {
  email: string;
  role: string;
  exp: number;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const atualizado = searchParams.get("atualizado") === "true";


  async function efetuarLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await api.post("/auth/login", { email, password });
      const token = resposta.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<PayloadToken>(token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("email", decoded.email);

      router.push("/");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErro("E-mail ou senha inválidos.");
      } else {
        setErro("Erro ao tentar realizar login. Tente novamente.");
      }
    }
  }

  return (
  <Container maxWidth="sm">
    <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Login
      </Typography>

      {atualizado && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Dados atualizados com sucesso. Faça login novamente.
        </Alert>
      )}

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Box component="form" onSubmit={efetuarLogin}>
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => router.push("/usuario/cadastrar")}
        >
          Não tem conta? Cadastre-se
        </Button>
      </Box>
    </Paper>
  </Container>
);
}