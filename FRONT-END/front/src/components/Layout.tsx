import { AppBar, Box, Container, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  permission?: string | null;
};

type Session = {
  user?: SessionUser;
};

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession() as { data: Session | null };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isAdmin = session?.user?.permission === 'Admin';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
              API-STREAMER
            </Link>
          </Typography>
          {session && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Olá, {session.user?.name}!
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                    Home
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/movies" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                    Meus Filmes
                  </Link>
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={handleClose}>
                    <Link href="/categories" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                      Categorias
                    </Link>
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem onClick={handleClose}>
                    <Link href="/users" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                      Usuários
                    </Link>
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
}