export interface ApiResponse<T> {
  result_code: number;
  msg: string;
  data: T;
  timestamp: number;
}

export interface Anime {
  id: number;
  name: string; // API uses 'name' instead of 'title'
  nameAlternative: string;
  slug: string;
  imagen: string; // API uses 'imagen' instead of 'poster'
  imagenCapitulo: string;
  type: string; // 'Serie', 'movie', 'OVA'
  status: string;
  genres: string | string[]; // API returns genres as comma-separated string, can be array after transformation
  rating: string | number; // API returns rating as string, can be number after transformation
  voteAverage: string;
  visitas: number;
  overview: string; // API uses 'overview' instead of 'description'
  aired: string;
  createdAt: string;
  lang: string; // 'sub' for subtitles, 'castellano' for Spanish dub
  episodeCount: string;
  latestEpisode: string;
  episodes?: Episode[];
  totalEpisodes?: number;
  
  // Computed properties for compatibility
  title?: string;
  description?: string;
  poster?: string;
  banner?: string;
  year?: number;
}

export interface Episode {
  id: number;
  animeId: number;
  title: string;
  number: number; // API uses 'number' instead of 'episodeNumber'
  visitas: string;
  createdAt: string;
  originEpisodeId: string;
  thumbnail?: string;
  duration?: string;
  players?: Player[];
  
  // Computed properties for compatibility
  episodeNumber?: number;
}

export interface Player {
  id: number;
  animeId: number;
  episodeId: number;
  server: string;
  link: string;
  status: string;
  createdAt: string;
  
  // Computed properties for compatibility
  name?: string;
  url?: string;
  quality?: string;
  type?: string;
}

export interface HomeData {
  latestMovies: Anime[];
  latestSeries: Anime[];
}

export interface ApiListResponse {
  list: Anime[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AnimeListParams {
  page?: number;
  size?: number;
  type?: 'movie' | 'series';
  status?: 'ongoing' | 'completed';
  genre?: string;
  sort?: 'latest' | 'popular' | 'rating';
  lang?: string; // 'sub' for subtitles, 'castellano' for Spanish dub
  keyword?: string;
}

export interface Genre {
  name: string;
  count: number;
}