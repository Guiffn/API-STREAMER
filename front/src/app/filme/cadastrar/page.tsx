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
      setErro("Erro ao cadastrar filme. Verifique os dados e tente novamente.");
    }
  };

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
          Cadastrar Filme
        </Typography>

        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

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
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#333',
                color: '#fff'
              },
            }}
          />
          <TextField
            select
            label="Categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            required
            fullWidth
            InputLabelProps={{ style: { color: "#8c8c8c" } }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#333',
                color: '#fff'
              },
              '& .MuiSelect-icon': {
                color: '#fff'
              }
            }}
          >
            <MenuItem value={0}>Selecionar...</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          
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
              '&:hover': {
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