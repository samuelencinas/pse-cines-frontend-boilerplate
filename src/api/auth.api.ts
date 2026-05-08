import { api } from './client';
import type { LoginResponse, RegisterResponse } from '../types/auth.types';

// Wrapper del API client para los endpoints de /auth/
export const AuthApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/login', { email, password });
    return data;
  },
  async register(email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/register', { email, password });
    return data;
  },
};
