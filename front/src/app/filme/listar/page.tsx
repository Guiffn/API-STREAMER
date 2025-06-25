"use client";

import api from "@/app/Services/api";
import { Filme } from "@/app/Types/filme";
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TablePagination,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";

function FilmeListar() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filmes, setFilmes] = useState<Filme[]>([]);

  useEffect(() => {
    api
      .get<Filme[]>("/movie")
      .then((resposta) => {
        setFilmes(resposta.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Meus Filmes
      </Typography>
      
      {/* Container da Tabela com Estilo Profissional */}
      <Paper 
        elevation={0} 
        sx={{ 
          backgroundColor: '#1f1f1f', 
          border: '1px solid #333',
          overflow: 'hidden' // Garante que as bordas arredondadas da tabela funcionem
        }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #444' } }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Categoria</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filmes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((filme) => (
                  <TableRow 
                    key={filme.id}
                    sx={{
                      '&:hover': { backgroundColor: '#2c2c2c' },
                      '& td, & th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ color: '#ccc' }}>{filme.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{filme.title}</TableCell>
                    {/* Acessa o nome da categoria com segurança */}
                    <TableCell sx={{ color: '#ccc' }}>{filme.category?.name ?? "Sem categoria"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
        {/* Componente de Paginação Estilizado para Tema Escuro */}
        <TablePagination
          component="div"
          count={filmes.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Itens por página"
          sx={{ 
            color: '#ccc',
            '& .MuiSelect-icon': {
              color: '#fff'
            }
          }}
        />
      </Paper>
    </Container>
  );
}

export default FilmeListar;