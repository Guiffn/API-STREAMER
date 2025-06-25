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
import api from "@/app/Services/api";
import { useRouter } from "next/navigation";

export default function CategoriaCadastrar() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      await api.post("/category", {
        name: nome,
        description: descricao,
      });

      setNome("");
      setDescricao("");
      router.push("/categoria/listar");
    } catch (err: any) {
      console.error("Erro ao cadastrar categoria:", err);
      setErro("Erro ao cadastrar categoria. Verifique os dados e tente novamente.");
    }
  }

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
          Cadastrar Categoria
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nome da Categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#333',
                color: '#fff'
              },
            }}
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#333',
                color: '#fff'
              },
            }}
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
              backgroundColor: "#e50914", // Vermelho Netflix
              "&:hover": {
                backgroundColor: "#f40612",
              },
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}