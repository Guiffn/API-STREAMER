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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={10} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
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
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}