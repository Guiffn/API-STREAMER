import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginResponse } from '@/types/interfaces';

// URL da sua API para o processo de autorização
const API_URL = 'http://localhost:5169/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data: LoginResponse = await res.json();
          
          if (data.user && data.token) {
            // CORREÇÃO: Retornar todos os dados necessários para a sessão
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              permission: data.user.permission, // Incluindo a permissão
              accessToken: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Erro ao conectar na API de autenticação: ", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // CORREÇÃO: Adicionar ID e Permissão ao token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.permission = (user as any).permission;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    // CORREÇÃO: Adicionar ID e Permissão à sessão do cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.permission = token.permission as string;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);