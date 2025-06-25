"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
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

      router.push("/usuario/login?atualizado=true");
    } catch (err) {
      setErro("Erro na conexão com o servidor");
      console.error("Erro ao cadastrar usuário:", err);
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
        minHeight: "calc(100vh - 120px)",
        backgroundColor: "#141414",
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
          Cadastre-se
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#e87c03', color: '#fff' }}>
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
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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
              backgroundColor: "#e50914",
              "&:hover": {
                backgroundColor: "#f40612",
              },
            }}
          >
            Cadastrar
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
            onClick={() => router.push("/usuario/login")}
          >
            Já tem uma conta? Entre agora.
          </Button>
        </Box>
      </Box>
    </Container>
  );
}