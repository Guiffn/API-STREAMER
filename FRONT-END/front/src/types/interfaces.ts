// Tipagem Models/User.cs
export interface User {
  id: number;
  name: string;
  email: string;
  permission: 'User' | 'Admin'; // Corresponde ao enum Permission no C#
}

// Tipagem LoginResponseDto.cs
export interface LoginResponse {
  token: string;
  user: User; // Adicionado user ao LoginResponse
}

// Nova tipagem Models/Category.cs
export interface Category {
  id: number;
  name: string;
  description: string;
}

// Nova tipagem Models/Movie.cs
export interface Movie {
  id: number;
  title: string;
  categoryId: number;
  userId: number;
  category?: Category; // Opcional, para quando a categoria é incluída na resposta
  user?: User; // Opcional, para quando o usuário é incluído na resposta
}