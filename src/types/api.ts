// API响应基础类型
export interface ApiResponse<T = any> {
  msg: string;
  timestamp: number;
  data: T;
  code?: number;
  message?: string;
  result_code?: number;
}

// 动漫基础信息
export interface Anime {
  id: number;
  name: string;
  nameAlternative?: string;
  slug?: string;
  imagen: string;
  imagenCapitulo?: string;
  type: 'movie' | 'series' | 'Serie' | 'Movie' | 'OVA' | 'ONA' | 'TV' | 'Special' | string; // API可能返回不同格式
  status: 'ongoing' | 'completed' | string | number; // API可能返回数字状态
  genres?: string;
  rating?: string;
  voteAverage?: string;
  visitas?: number;
  overview?: string;
  aired?: string;
  createdAt?: string;
  lang?: 'sub' | 'dub' | 'latino' | 'castellano' | string;
  episodeCount?: string;
  latestEpisode?: string;
}

// 剧集信息
export interface Episode {
  id: number;
  animeId: number;
  number: number;
  title?: string;
  duration?: string;
  createdAt?: string;
  url?: string;
  status?: string | number;
}

// 播放器信息
export interface Player {
  id: number;
  animeId: number;
  episodeId: number;
  server: string;
  link: string; // API返回的是link字段，不是url
  url?: string; // 兼容字段
  quality?: string;
  lang?: string;
  status?: string;
  createdAt?: string;
}

// 首页数据
export interface HomeData {
  latestMovies: Anime[];
  latestSeries: Anime[];
}

// 动漫详情数据
export interface AnimeDetail {
  anime: Anime;
  episodes: Episode[];
  totalEpisodes: number;
}

// 播放页面数据
export interface PlayData {
  episode: Episode;
  players: Player[];
  anime?: Anime;
}

// 列表查询参数
export interface ListParams {
  page?: number;
  size?: number;
  type?: 'movie' | 'series';
  status?: 'ongoing' | 'completed';
  genre?: string;
  lang?: string;
  sort?: 'latest' | 'popular' | 'rating';
  keyword?: string;
}

// 列表响应数据
export interface ListData {
  list: Anime[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

// 类型统计
export interface GenreStats {
  genre: string;
  count: number;
}

// 搜索参数
export interface SearchParams {
  q: string;
  page?: number;
  size?: number;
}