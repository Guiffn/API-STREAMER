"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "@/app/Services/api";
import { jwtDecode } from "jwt-decode";

type Usuario = {
  id: number;
  name: string;
  email: string;
};

type TokenPayload = {
  [key: string]: any;
};

export default function UsuarioBuscar() {
  const [id, setId] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");
  const [semPermissao, setSemPermissao] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Lógica de permissão...
    setCarregando(false);
  }, []);

  async function buscarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setUsuario(null);

    try {
      const resposta = await api.get<Usuario>(`/users/${id}`);
      setUsuario(resposta.data);
    } catch (err: any) {
      setErro("Usuário não encontrado.");
      console.error("Erro ao buscar usuário:", err);
    }
  }

  // Renderização de carregamento e permissão...

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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Buscar Usuário por ID
        </Typography>
        <Box
          component="form"
          onSubmit={buscarUsuario}
          sx={{ display: "flex", gap: 2, mb: 2, alignItems: 'center' }}
        >
          <TextField
            label="ID"
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
            sx={{
              backgroundColor: "#e50914",
              "&:hover": { backgroundColor: "#f40612" },
              height: '56px' // Alinha com a altura do TextField
            }}
          >
            Buscar
          </Button>
        </Box>

        {erro && <Alert severity="error">{erro}</Alert>}

        {usuario && (
          <Box sx={{ mt: 3, borderTop: '1px solid #444', pt: 2 }}>
            <Typography sx={{ mb: 1 }}><strong>ID:</strong> {usuario.id}</Typography>
            <Typography sx={{ mb: 1 }}><strong>Nome:</strong> {usuario.name}</Typography>
            <Typography><strong>Email:</strong> {usuario.email}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}