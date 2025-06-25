"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import api from "@/app/Services/api";

const pageGroups = {
  filmes: {
    title: "Gerenciar Filmes",
    pages: [
      { titulo: "Listar Filmes", caminho: "/filme/listar" },
      { titulo: "Cadastrar Filme", caminho: "/filme/cadastrar" },
      { titulo: "Editar Filme", caminho: "/filme/alterar" },
      { titulo: "Deletar Filme", caminho: "/filme/deletar" },
    ],
  },
  categorias: {
    title: "Gerenciar Categorias",
    pages: [
      { titulo: "Listar Categorias", caminho: "/categoria/listar" },
      { titulo: "Cadastrar Categoria", caminho: "/categoria/cadastrar" },
      { titulo: "Deletar Categoria", caminho: "/categoria/deletar" },
    ],
  },
  usuarios: {
    title: "Gerenciar Usuários",
    pages: [
      { titulo: "Meu Perfil", caminho: "/usuario/me" },
      { titulo: "Listar Usuários", caminho: "/usuario/listar" },
      { titulo: "Buscar Usuário", caminho: "/usuario/buscar" },
      { titulo: "Editar Usuário", caminho: "/usuario/alterar" },
      { titulo: "Deletar Usuario", caminho: "/usuario/deletar" },
    ],
  },
};

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

  const handleLogout = () => {
    localStorage.clear();
    router.push("/usuario/login");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : logado ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
            {/* TÍTULO ATUALIZADO */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                flexGrow: 1,
              }}
            >
              Painel de Controle 🎬
            </Typography>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#e50914",
                "&:hover": { backgroundColor: "#f40612" },
              }}
            >
              Sair
            </Button>
          </Box>

          {Object.values(pageGroups).map((group) => (
            <Box key={group.title} sx={{ mb: 5 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#e0e0e0' }}>
                {group.title}
              </Typography>
              <Divider sx={{ mb: 3, borderColor: '#444' }} />
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                }}
              >
                {group.pages.map((pagina) => (
                  <Box
                    key={pagina.caminho}
                    sx={{
                      flex: '1 1 calc(25% - 24px)',
                      minWidth: '250px',
                      display: 'flex',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #333",
                        transition: "transform 0.3s ease, border-color 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          borderColor: "#e50914",
                        },
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {pagina.titulo}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          mt: 2,
                          backgroundColor: "#333",
                          color: "#fff",
                          fontWeight: 'bold',
                          "&:hover": { backgroundColor: "#555" },
                        }}
                        onClick={() => router.push(pagina.caminho)}
                      >
                        Acessar
                      </Button>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 4 }}>
          Você precisa estar logado para acessar as funcionalidades.
        </Alert>
      )}
    </Container>
  );
}
