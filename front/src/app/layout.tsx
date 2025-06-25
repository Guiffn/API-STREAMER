"use client";

import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const fullScreenPages = ["/usuario/login", "/usuario/cadastrar"];
  const isFullScreenPage = fullScreenPages.includes(pathname);

  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <CssBaseline />
        
         <AppBar position="static" sx={{ bgcolor: "#000", boxShadow: 'none' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#e50914' }}>
              Streamer
            </Typography>
          </Toolbar>
        </AppBar>

  
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#141414' }}>
          {isFullScreenPage ? (
            children
          ) : (
            <Container sx={{ py: 4 }}>
              {children}
            </Container>
          )}
        </Box>

        {/* RODAPÉ */}
        <Box
          component="footer"
          sx={{
            bgcolor: "#000",
            color: "#808080",
            py: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            Desenvolvido pela equipe de Web Avançado
          </Typography>
        </Box>
      </body>
    </html>
  );
}