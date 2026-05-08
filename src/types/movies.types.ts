export interface SessionDto {
  cinema: string;
  day: string;
  start: string;
  end: string;
}

export interface MovieResponseDto {
  id: number;
  title: string;
  cast: string;
  sessions?: SessionDto[];
}

export interface MovieFiltersDto {
  id?: number;
  sessionBefore?: Date;
  sessionAfter?: Date;
  cast?: string[];
}

export interface CreateMovieDto {
  title: string;
  cast: string;
}

export interface UpdateMovieDto {
  title?: string;
  cast?: string;
}
