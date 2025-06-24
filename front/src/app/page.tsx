"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import api from "@/app/Services/api";

export default function Home() {
  const router = useRouter();
  const [logado, setLogado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setLogado(true))
      .catch(() => setLogado(false))
      .finally(() => setCarregando(false));
  }, []);

  const paginas = [
    { titulo: "Listar Usuários", caminho: "/usuario/listar" },
    { titulo: "Buscar Usuário", caminho: "/usuario/buscar" },
    { titulo: "Editar Usuário", caminho: "/usuario/alterar" },
    { titulo: "Cadastrar Filme", caminho: "/filme/cadastrar" },
    { titulo: "Listar Filmes", caminho: "/filme/listar" },
    { titulo: "Editar Filme", caminho: "/filme/alterar" },
    { titulo: "Deletar Filme", caminho: "/filme/deletar" },
    { titulo: "Cadastrar Categoria", caminho: "/categoria/cadastrar" },
    { titulo: "Listar Categorias", caminho: "/categoria/listar" },
    { titulo: "Deletar Categoria", caminho: "/categoria/deletar" },
    { titulo: "Meu Perfil", caminho: "/usuario/me" },
    { titulo: "Deletar Usuario", caminho: "/usuario/deletar" },

  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Painel 🎬
      </Typography>

      {carregando ? (
        <CircularProgress />
      ) : logado ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                localStorage.clear();
                router.push("/usuario/login");
              }}
            >
              Sair
            </Button>
          </Box>

          <Grid container spacing={2}>
            {paginas.map((pagina, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={4} sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="subtitle1">{pagina.titulo}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => router.push(pagina.caminho)}
                  >
                    Acessar
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 4 }}>
          Você precisa estar logado para acessar as funcionalidades.
        </Alert>
      )}
    </Container>
  );
}