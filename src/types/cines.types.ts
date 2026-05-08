export interface CinemaFiltersDto {
  id?: number;
  sessionBefore?: Date;
  sessionAfter?: Date;
  withMovie?: number;
  withCatalog?: boolean;
}

export interface CinemaSessionDto {
  id: number;
  date: string;
  start: string;
  end: string;
  availableSeats: number;
}

export interface CinemaCatalogDto {
  id: number;
  title: string;
  sessions: CinemaSessionDto[];
}

export interface CinemaResponseDto {
  id: number;
  name: string;
  capacity: number;
  catalog?: CinemaCatalogDto[];
}

export interface CreateCinemaDto {
  name: string;
  capacity: number;
}

export interface UpdateCinemaDto {
  name?: string;
  capacity?: number;
}
