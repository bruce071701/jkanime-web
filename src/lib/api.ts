import { ApiResponse, Anime, HomeData, Episode, Player, Genre, AnimeListParams, ApiListResponse } from '@/types/anime';
import { mockApiClient } from './mock-api';

// Use different URLs for server-side and client-side
const getApiBaseUrl = () => {
    // 直接使用生产环境 API
    return 'https://api-jk.funnyu.xyz';
};

const API_BASE_URL = getApiBaseUrl();
const USE_MOCK_API = false; // 强制使用生产环境API

// Next.js 15 兼容性：确保在客户端环境中正确初始化
if (typeof window !== 'undefined') {
    // 客户端初始化
}



class ApiClient {
    private async request<T>(endpoint: string): Promise<T> {
        try {
            const fetchOptions: RequestInit = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Only add Next.js cache options on server-side
            if (typeof window === 'undefined') {
                (fetchOptions as any).next = { revalidate: 600 }; // 10 minutos de cache
            }
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
            
            // Handle health check endpoint which returns plain text
            if (endpoint === '/api/v1/test/health') {
                const text = await response.text();
                return text as unknown as T;
            }
            
            let result: any;
            try {
                result = await response.json();
            } catch (jsonError) {
                throw new Error('Invalid JSON response from API');
            }
            
            // Handle different API response formats
            if (result.result_code !== undefined) {
                // Old format with result_code
                if (result.result_code !== 200) {
                    throw new Error(result.msg || 'API returned error');
                }
                return result.data;
            } else if (result.msg !== undefined) {
                // New format with msg
                if (result.msg !== 'succeed') {
                    throw new Error(result.msg || 'API returned error');
                }
                return result.data;
            } else {
                // Direct data response
                return result;
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error or API unavailable');
        }
    }

    async getHomeData(): Promise<HomeData> {
        if (USE_MOCK_API) {
            try {
                return await mockApiClient.getHomeData();
            } catch (error) {
                throw new Error('Error loading mock data');
            }
        }
        
        try {
            // 使用本地 API 代理避免 CORS 问题
            let baseUrl = '';
            if (typeof window === 'undefined') {
                // 服务器端
                baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            } else {
                // 客户端
                baseUrl = window.location.origin;
            }
            
            const response = await fetch(`${baseUrl}/api/anime/home`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }
            
            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                throw new Error('Invalid JSON response from server');
            }
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Handle different API response formats
            let data;
            if (result.result_code !== undefined) {
                // Old format with result_code
                if (result.result_code !== 200) {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else if (result.msg !== undefined) {
                // New format with msg
                if (result.msg !== 'succeed') {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else {
                // Direct data response
                data = result;
            }
            
            // 确保数据存在并有正确的结构
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format received from API');
            }
            
            // 安全处理数组数据
            const latestMovies = Array.isArray(data.latestMovies) ? data.latestMovies : [];
            const latestSeries = Array.isArray(data.latestSeries) ? data.latestSeries : [];
            
            const processedData = {
                latestMovies: latestMovies.map((anime: any, index: number) => {
                    try {
                        return this.transformAnime(anime);
                    } catch (error) {
                        return null;
                    }
                }).filter(Boolean),
                latestSeries: latestSeries.map((anime: any, index: number) => {
                    try {
                        return this.transformAnime(anime);
                    } catch (error) {
                        return null;
                    }
                }).filter(Boolean)
            };
            
            return processedData;
        } catch (error) {
            throw error;
        }
    }

    async getAnimeDetail(animeId: number): Promise<Anime> {
        if (USE_MOCK_API) {
            return mockApiClient.getAnimeDetail(animeId);
        }
        
        try {
            // 使用本地 API 代理避免 CORS 问题
            let baseUrl = '';
            if (typeof window === 'undefined') {
                // 服务器端
                baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            } else {
                // 客户端
                baseUrl = window.location.origin;
            }
            
            const response = await fetch(`${baseUrl}/api/anime/detail/${animeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Handle different API response formats
            let data;
            if (result.result_code !== undefined) {
                // Old format with result_code
                if (result.result_code !== 200) {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else if (result.msg !== undefined) {
                // New format with msg
                if (result.msg !== 'succeed') {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else {
                // Direct data response
                data = result;
            }
            
            // 确保数据存在
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid anime detail data received from API');
            }
            
            // Ensure we have anime data
            const animeData = data.anime || data;
            if (!animeData || !animeData.id) {
                throw new Error('No anime data found in API response');
            }
            
            const transformedAnime = this.transformAnime(animeData);
            transformedAnime.episodes = (data.episodes || []).map((ep: any) => ({
                ...ep,
                episodeNumber: ep.number || ep.episodeNumber,
                title: ep.title || `Episodio ${ep.number || ep.episodeNumber || 'N/A'}`
            }));
            transformedAnime.totalEpisodes = data.totalEpisodes || data.currentEpisodes || 0;
            
            return transformedAnime;
        } catch (error) {
            throw error;
        }
    }

    async getEpisodePlay(episodeId: number): Promise<{ episode: Episode; players: Player[] }> {
        if (USE_MOCK_API) {
            return mockApiClient.getEpisodePlay(episodeId);
        }
        
        try {
            // 使用本地 API 代理避免 CORS 问题
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : window.location.origin;
            
            const response = await fetch(`${baseUrl}/api/anime/play/${episodeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Handle different API response formats
            let data;
            if (result.result_code !== undefined) {
                // Old format with result_code
                if (result.result_code !== 200) {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else if (result.msg !== undefined) {
                // New format with msg
                if (result.msg !== 'succeed') {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else {
                // Direct data response
                data = result;
            }
            
            // Transform episode data
            const transformedEpisode = {
                ...data.episode,
                episodeNumber: data.episode.number || data.episode.id
            };
            
            // Transform players data
            const transformedPlayers = (data.players || []).map((player: any) => this.transformPlayer(player));
            
            return {
                episode: transformedEpisode,
                players: transformedPlayers
            };
        } catch (error) {
            throw error;
        }
    }

    async getAnimeList(params: AnimeListParams = {}): Promise<{ animes: Anime[]; total: number; page: number; size: number }> {
        if (USE_MOCK_API) {
            return mockApiClient.getAnimeList(params);
        }

        try {
            
            // Build query parameters
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    // Handle the type parameter mapping
                    if (key === 'type') {
                        if (value === 'series') {
                            // For series, we want type='Serie'
                            searchParams.append(key, 'Serie');
                            return;
                        } else if (value === 'movie') {
                            // For movies, we want type='movie'
                            searchParams.append(key, 'movie');
                            return;
                        }
                    }
                    searchParams.append(key, value.toString());
                }
            });

            const queryString = searchParams.toString();
            
            // 使用本地 API 代理避免 CORS 问题
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : window.location.origin;
            
            const url = `${baseUrl}/api/anime/list${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Handle different API response formats
            let data;
            if (result.result_code !== undefined) {
                // Old format with result_code
                if (result.result_code !== 200) {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else if (result.msg !== undefined) {
                // New format with msg
                if (result.msg !== 'succeed') {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else {
                // Direct data response
                data = result;
            }
            
            // Transform API response to match our expected format
            const transformedAnimes = (data.list || data.animes || []).map((anime: any) => this.transformAnime(anime));
            
            return {
                animes: transformedAnimes,
                total: data.pagination?.totalCount || data.total || transformedAnimes.length,
                page: data.pagination?.currentPage || data.page || params.page || 1,
                size: data.pagination?.pageSize || data.size || params.size || 24
            };
        } catch (error) {
            throw error;
        }
    }

    private transformAnime = (apiAnime: any): Anime => {
        // 确保 apiAnime 存在
        if (!apiAnime || typeof apiAnime !== 'object') {
            throw new Error('Invalid anime data received from API');
        }
        
        // Ensure we have required fields
        if (!apiAnime.id) {
            throw new Error('Anime data missing required ID field');
        }
        
        const transformedAnime: Anime = {
            ...apiAnime,
            // Ensure we have a name
            name: apiAnime.name || apiAnime.title || 'Unknown Title',
            nameAlternative: apiAnime.nameAlternative || apiAnime.name || apiAnime.title || '',
            type: ['serie', 'tv', 'series', 'Serie'].includes(apiAnime.type) ? 'series' : 'movie',
            status: apiAnime.status === '0' || apiAnime.status === 0 ? 'ongoing' : 'completed',
            // 兼容性字段
            title: apiAnime.name || apiAnime.title || 'Unknown Title',
            description: apiAnime.overview || apiAnime.description || '',
            poster: apiAnime.imagen || apiAnime.poster || '',
            banner: apiAnime.imagenCapitulo || apiAnime.imagen || apiAnime.banner || '',
            year: apiAnime.aired ? this.extractYear(apiAnime.aired) : undefined,
            // Ensure we have default values for required fields
            slug: apiAnime.slug || '',
            imagen: apiAnime.imagen || '',
            imagenCapitulo: apiAnime.imagenCapitulo || apiAnime.imagen || '',
            voteAverage: apiAnime.voteAverage || '',
            visitas: apiAnime.visitas || 0,
            overview: apiAnime.overview || apiAnime.description || '',
            aired: apiAnime.aired || '',
            createdAt: apiAnime.createdAt || '',
            lang: apiAnime.lang || 'sub',
            episodeCount: apiAnime.episodeCount || '',
            latestEpisode: apiAnime.latestEpisode || '',
        };

        // Handle genres - convert string to array if needed
        if (typeof apiAnime.genres === 'string' && apiAnime.genres) {
            transformedAnime.genres = apiAnime.genres.split(',').map((g: string) => g.trim());
        } else if (Array.isArray(apiAnime.genres)) {
            transformedAnime.genres = apiAnime.genres;
        } else {
            transformedAnime.genres = [];
        }

        // Handle rating - keep as string or number as per type definition
        if (typeof apiAnime.rating === 'string') {
            transformedAnime.rating = apiAnime.rating;
        } else if (typeof apiAnime.rating === 'number') {
            transformedAnime.rating = apiAnime.rating;
        } else {
            transformedAnime.rating = "0";
        }

        return transformedAnime;
    }

    private extractYear = (airedString: string): number | undefined => {
        const match = airedString.match(/\d{4}/);
        return match ? parseInt(match[0]) : undefined;
    }

    private transformPlayer = (apiPlayer: Player): Player => {
        return {
            ...apiPlayer,
            // Add computed properties for compatibility
            name: this.getServerDisplayName(apiPlayer.server),
            url: apiPlayer.link,
            type: apiPlayer.server,
            quality: this.getServerQuality(apiPlayer.server)
        };
    }

    private getServerDisplayName = (server: string): string => {
        const serverNames: { [key: string]: string } = {
            'doodstream': 'DoodStream',
            'filemoon': 'FileMoon',
            'mediafire': 'MediaFire',
            'mega': 'MEGA',
            'mixdrop': 'MixDrop',
            'mp4upload': 'MP4Upload',
            'savefiles': 'SaveFiles',
            'streamtape': 'StreamTape',
            'streamwish': 'StreamWish',
            'vidhide': 'VidHide',
            'voe': 'VOE'
        };
        return serverNames[server.toLowerCase()] || server.charAt(0).toUpperCase() + server.slice(1);
    }

    private getServerQuality = (server: string): string => {
        // Define quality based on server reliability/quality
        const serverQualities: { [key: string]: string } = {
            'mega': 'HD',
            'mediafire': 'HD',
            'streamtape': 'HD',
            'filemoon': 'HD',
            'doodstream': 'SD',
            'mixdrop': 'SD',
            'mp4upload': 'SD',
            'savefiles': 'SD',
            'streamwish': 'SD',
            'vidhide': 'SD',
            'voe': 'SD'
        };
        return serverQualities[server.toLowerCase()] || 'SD';
    }

    async getGenres(): Promise<Genre[]> {
        if (USE_MOCK_API) {
            return mockApiClient.getGenres();
        }
        
        try {
            
            // 使用本地 API 代理避免 CORS 问题
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : window.location.origin;
            
            const response = await fetch(`${baseUrl}/api/anime/genres`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Handle different API response formats
            let data;
            if (result.result_code !== undefined) {
                // Old format with result_code
                if (result.result_code !== 200) {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else if (result.msg !== undefined) {
                // New format with msg
                if (result.msg !== 'succeed') {
                    throw new Error(result.msg || 'API returned error');
                }
                data = result.data;
            } else {
                // Direct data response
                data = result;
            }
            
            return data.genres || [];
        } catch (error) {
            throw error;
        }
    }

    async searchAnime(query: string, page = 1, size = 20): Promise<{ animes: Anime[]; total: number }> {
        if (USE_MOCK_API) {
            return mockApiClient.searchAnime(query, page, size);
        }

        const searchParams = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString()
        });

        const response = await this.request<{keyword: string; list: Anime[]; pagination: any}>(`/api/v1/anime/search?${searchParams}`);
        
        return {
            animes: response.list.map((anime: any) => this.transformAnime(anime)),
            total: response.pagination.totalCount
        };
    }
}

export const apiClient = new ApiClient();