"use client";


import api from "@/app/Services/api";
import { Filme } from "@/app/Types/filme";
import { Container, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function FilmeListar() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [Filmes, setFilmes] = useState<Filme[]>([]);

  useEffect(() => {
    api
      .get<Filme[]>("/movie")
      .then((resposta) => {
        setFilmes(resposta.data);
        console.table(resposta.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Listar Filmes
      </Typography>
      <TableContainer component={Paper} elevation={10}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Filmes
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              .map((Filme) => (
                <TableRow key={Filme.id}>
                  <TableCell>{Filme.id}</TableCell>
                  <TableCell>{Filme.title}</TableCell>
                  <TableCell>{Filme.category?.name ?? "Sem categoria"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={Filmes.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Itens por página"
        />
      </TableContainer>
    </Container>
  );
}

export default FilmeListar;