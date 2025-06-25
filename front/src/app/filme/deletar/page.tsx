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
          Deletar Filme
        </Typography>
        {mensagem && <Alert severity="success" sx={{ mb: 2 }}>{mensagem}</Alert>}
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
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
              backgroundColor: "#e50914",
              "&:hover": {
                backgroundColor: "#f40612",
              },
            }}
          >
            Deletar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}