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

export default function FilmeDeletar() {
  const [id, setId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      await api.delete(`/movie/${id}`);
      setMensagem(`Filme com ID ${id} deletado com sucesso.`);
      setId("");
    } catch (err: any) {
      setErro("Erro ao deletar o filme. Verifique o ID e tente novamente.");
      console.error("Erro ao deletar filme:", err);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={10} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Deletar Filme
        </Typography>
        {mensagem && <Alert severity="success">{mensagem}</Alert>}
        {erro && <Alert severity="error">{erro}</Alert>}
        <Box
          component="form"
          onSubmit={handleDelete}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="ID do Filme"
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="error">
            Deletar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}