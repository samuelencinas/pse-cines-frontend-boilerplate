export type Role = 'CLIENT' | 'CINEMA' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
  details?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  details?: string;
}
