import { api } from './client';
import type {
  MovieFiltersDto,
  MovieResponseDto,
  CreateMovieDto,
  UpdateMovieDto,
} from '../types/movies.types';

// Wrapper del API client para los endpoints de /movies/
export const MoviesApi = {
  async list(filters: MovieFiltersDto = {}): Promise<MovieResponseDto[]> {
    const { data } = await api.post<MovieResponseDto[]>('/movies', filters);
    return data;
  },
  async create(payload: CreateMovieDto): Promise<MovieResponseDto> {
    const { data } = await api.post<MovieResponseDto>('/movies/create', payload);
    return data;
  },
  async update(id: number, payload: UpdateMovieDto): Promise<MovieResponseDto> {
    const { data } = await api.put<MovieResponseDto>(`/movies/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/movies/${id}`);
  },
};
