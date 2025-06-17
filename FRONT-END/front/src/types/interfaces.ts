// Tipagem Models/User.cs
export interface User {
  id: number;
  name: string;
  email: string;
  permission: 'User' | 'Admin';
}

// Tipagem LoginResponseDto.cs
export interface LoginResponse {
  token: string;
  user: User;
}