"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import api from "@/app/Services/api";

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

      if (decodedRole === "Admin") {
        api
          .get("/users")
          .then((res) => setUsuarios(res.data))
          .catch(() => setErro("Erro ao carregar usuários."))
          .finally(() => setCarregando(false));
      } else {
        setCarregando(false);
      }
    } catch {
      setErro("Token inválido.");
      setCarregando(false);
    }
  }, []);

  if (carregando) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#e50914' }} />
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Lista de Usuários
      </Typography>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #333',
          p: 2,
        }}
      >
        <List>
          {usuarios.map((user, index) => (
            <div key={user.id}>
              <ListItem>
                <ListItemText
                  primary={`${user.name} (${user.email})`}
                  primaryTypographyProps={{ color: '#fff', fontWeight: 'bold' }}
                  secondary={`Permissão: ${user.permission === 1 ? "Admin" : "Usuário"}`}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
              {index < usuarios.length - 1 && <Divider sx={{ borderColor: '#444' }} />}
            </div>
          ))}
        </List>
      </Paper>
    </Container>
  );
}