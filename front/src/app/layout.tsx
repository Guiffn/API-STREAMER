import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {/* Barra de ferramentadas */}
       <AppBar position="static" sx={{ bgcolor: "#000", color: "#FFD500" }}>
  <Toolbar>
    <Typography variant="h6" component="div">
      Streamer
    </Typography>
  </Toolbar>
</AppBar>

        {/* Conteúdo - Componentes criados por nós */}
        <Box component="main"
          sx={{ minHeight: "calc(100vh - 120px)", py: 4 }}>
          <Container>
            {children}
          </Container>
        </Box>

        {/* Rodapé */}
       <Box
  component="footer"
  sx={{
    bgcolor: "#000", // fundo preto
    color: "#FFD500", // texto amarelo Borussia
    py: 2,
    textAlign: "center",
  }}
>
  <Typography variant="body2">
    Desenvolvedores Da Mateia de Web Avançado
  </Typography>
</Box>

      </body>
    </html>
  );
}