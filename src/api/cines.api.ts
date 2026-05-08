import { api } from './client';
import type {
  CinemaFiltersDto,
  CinemaResponseDto,
  CreateCinemaDto,
  UpdateCinemaDto,
} from '../types/cines.types';

// Wrapper del API client para los endpoints de /cinemas/
export const CinesApi = {
  async list(filters: CinemaFiltersDto = {}): Promise<CinemaResponseDto[]> {
    const { data } = await api.post<CinemaResponseDto[]>('/cinemas', filters);
    return data;
  },
  async create(payload: CreateCinemaDto): Promise<CinemaResponseDto> {
    const { data } = await api.post<CinemaResponseDto>('/cinemas/create', payload);
    return data;
  },
  async update(id: number, payload: UpdateCinemaDto): Promise<CinemaResponseDto> {
    const { data } = await api.put<CinemaResponseDto>(`/cinemas/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/cinemas/${id}`);
  },
};
