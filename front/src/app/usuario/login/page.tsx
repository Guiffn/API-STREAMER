"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import api from "@/app/Services/api";
import { jwtDecode } from "jwt-decode";

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
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)", // Altura da tela menos header/footer
        backgroundColor: "#141414", // Fundo preto Netflix
      }}
    >
      <Box
        sx={{
          p: 4,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderRadius: 2,
          color: "#fff",
          maxWidth: "450px",
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Entrar
        </Typography>

        {atualizado && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Dados atualizados com sucesso. Faça login novamente.
          </Alert>
        )}

        {erro && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#e87c03', color: '#fff' }}>
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
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            InputProps={{
              style: { backgroundColor: "#333", color: "#fff" },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            InputProps={{
              style: { backgroundColor: "#333", color: "#fff" },
            }}
             sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#e50914", // Vermelho Netflix
              "&:hover": {
                backgroundColor: "#f40612", // Vermelho mais claro no hover
              },
            }}
          >
            Entrar
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{
              color: "#b3b3b3",
              textTransform: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={() => router.push("/usuario/cadastrar")}
          >
            Não tem conta? Cadastre-se
          </Button>
        </Box>
      </Box>
    </Container>
  );
}