"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import api from "@/app/Services/api";

// Como a claim de role tem o nome completo, usamos tipo dinâmico
type TokenPayload = {
  [key: string]: any;
};

type User = {
  id: number;
  name: string;
  email: string;
  permission: number;
};

export default function ListarUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [erro, setErro] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Você precisa estar logado.");
      setCarregando(false);
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      const decodedRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setRole(decodedRole);
    } catch {
      setErro("Token inválido.");
      setCarregando(false);
      return;
    }

    // Buscar usuários somente se for admin
    api
      .get("/users")
      .then((res) => setUsuarios(res.data))
      .catch(() => setErro("Erro ao carregar usuários."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (role !== "Admin") {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">Apenas administradores podem acessar esta página.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Usuários
        </Typography>

        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

        <List>
          {usuarios.map((user) => (
            <Box key={user.id}>
              <ListItem>
                <ListItemText
                  primary={`${user.name} (${user.email})`}
                  secondary={`Permissão: ${user.permission === 1 ? "Admin" : "Usuário"}`}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      </Paper>
    </Container>
  );
}