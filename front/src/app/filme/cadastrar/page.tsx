"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Categoria } from "@/app/Types/categoria";
import api from "@/app/Services/api";
import {
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";

export default function FilmeCadastrar() {
  const [titulo, setTitulo] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const router = useRouter();

  useEffect(() => {
    api
      .get<Categoria[]>("/category")
      .then((res) => setCategorias(res.data))
      .catch(() => setErro("Erro ao buscar categorias."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!titulo.trim() || categoriaId === "" || categoriaId === 0) {
      setErro("Preencha todos os campos antes de salvar.");
      return;
    }

    const novoFilme = {
      title: titulo.trim(),
      categoryId: Number(categoriaId),
    };

    try {
      await api.post("/movie", novoFilme);
      setSucesso("Filme cadastrado com sucesso!");
      setTitulo("");
      setCategoriaId("");
      setTimeout(() => {
        router.push("/filme/listar");
      }, 1500);
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data?.toString() || "";

      // Verifica erro de duplicidade
      if (data.includes("Duplicate entry")) {
        const tituloDuplicado = titulo.toUpperCase();
        setErro(`O filme "${tituloDuplicado}" já foi cadastrado por outro usuário.`);
        return;
      }

      if (status === 400 || status === 409) {
        setErro("Filme já cadastrado ou inválido.");
      } else {
        setErro("Erro ao cadastrar filme. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={10} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Cadastrar Filme
        </Typography>

        {erro && <Alert severity="error">{erro}</Alert>}
        {sucesso && <Alert severity="success">{sucesso}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Título do Filme"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            required
            fullWidth
          >
            <MenuItem value={0}>Selecionar...</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}