import { 
  HomeData, 
  AnimeDetail, 
  PlayData, 
  ListData, 
  ListParams, 
  GenreStats, 
  SearchParams 
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-jk.funnyu.xyz';

class ApiService {
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // 处理不同的API响应格式
    if (result.msg === 'succeed') {
      return result.data;
    } else if (result.message === 'success' || result.code === 200) {
      return result.data;
    } else if (result.result_code === 200) {
      return result.data;
    } else if (result.error) {
      throw new Error(result.error);
    } else if (result.msg && result.msg !== 'succeed') {
      throw new Error(result.msg);
    } else if (result.data) {
      return result.data;
    } else {
      // 如果没有标准格式，直接返回结果
      return result;
    }
  }

  // 健康检查 - 使用首页API作为健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.getHomeData();
      return true;
    } catch {
      return false;
    }
  }

  // 获取首页数据
  async getHomeData(): Promise<HomeData> {
    return this.request<HomeData>('/anime/home');
  }

  // 获取动漫详情
  async getAnimeDetail(animeId: number): Promise<AnimeDetail> {
    return this.request<AnimeDetail>(`/anime/detail/${animeId}`);
  }

  // 获取播放信息
  async getPlayData(episodeId: number): Promise<PlayData> {
    return this.request<PlayData>(`/anime/play/${episodeId}`);
  }

  // 获取动漫列表
  async getAnimeList(params: ListParams = {}): Promise<ListData> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return this.request<ListData>(`/anime/list${queryString ? `?${queryString}` : ''}`);
  }

  // 获取类型统计
  async getGenres(): Promise<GenreStats[]> {
    const response = await this.request<{ genres: Array<{ name: string; count: number }> }>('/anime/genres');
    // 转换API响应格式为我们期望的格式
    return response.genres.map(genre => ({
      genre: genre.name,
      count: genre.count
    }));
  }

  // 搜索动漫
  async searchAnime(params: SearchParams): Promise<ListData> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const response = await this.request<any>(`/anime/search?${searchParams.toString()}`);
    
    // 转换搜索API的响应格式为标准格式
    return {
      list: response.list || [],
      pagination: {
        page: response.pagination?.currentPage || 1,
        size: response.pagination?.pageSize || 24,
        total: response.pagination?.totalCount || 0,
        totalPages: response.pagination?.totalPages || 1
      }
    };
  }
}

export const apiService = new ApiService();