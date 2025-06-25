"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import api from "@/app/Services/api";
import { Categoria } from "@/app/Types/categoria";

type Filme = {
  id: number;
  title: string;
  categoryId: number;
};

export default function FilmeEditar() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [filmeSelecionadoId, setFilmeSelecionadoId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/movie")
      .then((res) => setFilmes(res.data))
      .catch(() => setErro("Erro ao carregar filmes."));

    api.get("/category")
      .then((res) => setCategorias(res.data))
      .catch(() => setErro("Erro ao carregar categorias."));
  }, []);

  useEffect(() => {
    if (filmeSelecionadoId) {
      const filme = filmes.find((f) => f.id.toString() === filmeSelecionadoId);
      if (filme) {
        setTitulo(filme.title);
        setCategoriaId(filme.categoryId.toString());
      }
    } else {
      setTitulo("");
      setCategoriaId("");
    }
  }, [filmeSelecionadoId, filmes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    const dados: { title?: string; categoryId?: string } = {};

    const tituloLimpo = typeof titulo === "string" ? titulo.trim() : "";
    const categoriaIdLimpo = typeof categoriaId === "string" ? categoriaId.trim() : "";

    if (tituloLimpo) dados.title = tituloLimpo;
    if (categoriaIdLimpo) dados.categoryId = categoriaIdLimpo;

    if (Object.keys(dados).length === 0) {
      setErro("Preencha ao menos um campo para atualizar.");
      return;
    }

    try {
      await api.put(`/movie/${filmeSelecionadoId}`, dados);
      setMensagem("Filme atualizado com sucesso.");
    } catch {
      setErro("Erro ao atualizar o filme.");
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
          Editar Filme
        </Typography>

        {mensagem && <Alert severity="success" sx={{ mb: 2 }}>{mensagem}</Alert>}
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            select
            label="Selecione um Filme"
            value={filmeSelecionadoId}
            onChange={(e) => setFilmeSelecionadoId(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' },
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            <MenuItem value="">Selecionar...</MenuItem>
            {filmes.map((filme) => (
              <MenuItem key={filme.id} value={filme.id.toString()}>
                {filme.title} (ID {filme.id})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Novo Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' }
            }}
          />

          <TextField
            select
            label="Nova Categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#333', color: '#fff' },
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            <MenuItem value="">Selecionar...</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={!filmeSelecionadoId}
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#e50914",
              '&:hover': { backgroundColor: '#f40612' },
              '&.Mui-disabled': { // Estilo para o botão desabilitado
                backgroundColor: '#555',
                color: '#888'
              }
            }}
          >
            Atualizar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}