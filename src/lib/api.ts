import { ApiResponse, Anime, HomeData, Episode, Player, Genre, AnimeListParams, ApiListResponse } from '@/types/anime';
import { mockApiClient } from './mock-api';

// Use different URLs for server-side and client-side
const getApiBaseUrl = () => {
    // Server-side rendering
    if (typeof window === 'undefined') {
        return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    }
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

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
            return mockApiClient.getHomeData();
        }
        
        try {
            
            // Use Next.js API proxy to avoid CORS issues
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : '';
            const response = await fetch(`${baseUrl}/api/anime/home`, {
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
            
            return {
                latestMovies: data.latestMovies.map(this.transformAnime),
                latestSeries: data.latestSeries.map(this.transformAnime)
            };
        } catch (error) {
            throw error;
        }
    }

    async getAnimeDetail(animeId: number): Promise<Anime> {
        if (USE_MOCK_API) {
            return mockApiClient.getAnimeDetail(animeId);
        }
        
        try {
            
            // Use Next.js API proxy to avoid CORS issues
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : '';
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
            
            const transformedAnime = this.transformAnime(data.anime);
            transformedAnime.episodes = data.episodes?.map((ep: any) => ({
                ...ep,
                episodeNumber: ep.number,
                title: ep.title || `Episodio ${ep.number}`
            })) || [];
            transformedAnime.totalEpisodes = data.totalEpisodes || data.currentEpisodes;
            
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
            
            // Use Next.js API proxy to avoid CORS issues
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : '';
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
            const transformedPlayers = (data.players || []).map(this.transformPlayer);
            
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
            
            // Use Next.js API proxy to avoid CORS issues
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : '';
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
            const transformedAnimes = (data.list || data.animes || []).map(this.transformAnime);
            
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
        const transformedAnime: Anime = {
            ...apiAnime,
            title: apiAnime.name || apiAnime.title,
            description: apiAnime.overview,
            poster: apiAnime.imagen,
            banner: apiAnime.imagenCapitulo || apiAnime.imagen,
            type: ['serie', 'tv', 'series'].includes(apiAnime.type?.toLowerCase()) ? 'series' : 'movie',
            status: apiAnime.status === '0' || apiAnime.status === 0 ? 'ongoing' : 'completed',
            year: apiAnime.aired ? this.extractYear(apiAnime.aired) : undefined,
            lang: apiAnime.lang,
        };

        // Handle genres - convert string to array if needed
        if (typeof apiAnime.genres === 'string' && apiAnime.genres) {
            transformedAnime.genres = apiAnime.genres.split(',').map(g => g.trim());
        } else if (Array.isArray(apiAnime.genres)) {
            transformedAnime.genres = apiAnime.genres;
        } else {
            transformedAnime.genres = [];
        }

        // Handle rating - convert to number if it's a string
        if (typeof apiAnime.rating === 'string' && apiAnime.rating) {
            const numRating = parseFloat(apiAnime.rating);
            transformedAnime.rating = isNaN(numRating) ? undefined : numRating / 1000;
        } else if (typeof apiAnime.rating === 'number') {
            transformedAnime.rating = apiAnime.rating;
        } else {
            transformedAnime.rating = undefined;
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
            
            // Use Next.js API proxy to avoid CORS issues
            const baseUrl = typeof window === 'undefined' 
                ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
                : '';
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
            animes: response.list.map(this.transformAnime),
            total: response.pagination.totalCount
        };
    }
}

export const apiClient = new ApiClient();