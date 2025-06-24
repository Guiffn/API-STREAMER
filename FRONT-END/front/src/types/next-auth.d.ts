import 'next-auth';

 
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      permission?: string | null;
    };
  }
}
 
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    permission?: string;
    accessToken?: string;
  }
}