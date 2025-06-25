"use client";

import api from "@/app/Services/api";
import { Categoria } from "@/app/Types/categoria";
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Box 
} from "@mui/material";
import { useEffect, useState } from "react";

export default function CategoriaListar() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    api
      .get<Categoria[]>("/category")
      .then((resposta) => {
        setCategorias(resposta.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Categorias de Filmes
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          backgroundColor: '#1f1f1f', 
          border: '1px solid #333',
          overflow: 'hidden' 
        }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #444' } }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                  <TableRow 
                    key={categoria.id}
                    sx={{
                      '&:hover': { backgroundColor: '#2c2c2c' },
                      '& td, & th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ color: '#ccc' }}>{categoria.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{categoria.name}</TableCell>
                    <TableCell sx={{ color: '#ccc' }}>{categoria.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
}