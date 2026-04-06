export interface CinemaFiltersDto {
  id?: number;
  sessionBefore?: Date;
  sessionAfter?: Date;
  withMovie?: number;
  withCatalog?: boolean;
}

export interface CinemaCatalogDto {
  id: number;
  title: string;
  sessions: Array<{
    date: string;
    start: string;
    end: string;
  }>;
}

export interface CinemaResponseDto {
  id: number;
  name: string;
  capacity: number;
  catalog?: CinemaCatalogDto[];
}