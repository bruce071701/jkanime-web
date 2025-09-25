import { ApiResponse, Anime, HomeData, Episode, Player, Genre, AnimeListParams } from '@/types/anime';

// Simplified mock data for development
const mockAnimes: any[] = [
  {
    id: 1,
    name: "Your Name",
    nameAlternative: "Kimi no Na wa",
    slug: "your-name",
    imagen: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/q719jXXEzOoYaps6babgKnONONX.jpg",
    imagenCapitulo: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg",
    type: "movie",
    status: "completed",
    genres: "Romance,Drama,Sobrenatural",
    rating: "8.4",
    voteAverage: "8.4",
    visitas: 1000,
    overview: "Una historia de amor que trasciende el tiempo y el espacio.",
    aired: "2016-08-26",
    createdAt: "2024-01-01",
    lang: "sub",
    episodeCount: "1",
    latestEpisode: "1"
  },
  {
    id: 2,
    name: "Attack on Titan",
    nameAlternative: "Shingeki no Kyojin",
    slug: "attack-on-titan",
    imagen: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    imagenCapitulo: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/8pTHNQlWpuYAqyHN1kCQeqbbNTz.jpg",
    type: "series",
    status: "completed",
    genres: "Acción,Drama,Fantasía",
    rating: "9.0",
    voteAverage: "9.0",
    visitas: 5000,
    overview: "La humanidad lucha por sobrevivir contra los titanes.",
    aired: "2013-04-07",
    createdAt: "2024-01-01",
    lang: "sub",
    episodeCount: "87",
    latestEpisode: "87"
  }
];

const mockGenres: Genre[] = [
  { name: "Acción", count: 150 },
  { name: "Aventura", count: 120 },
  { name: "Comedia", count: 80 },
  { name: "Drama", count: 200 },
  { name: "Fantasía", count: 90 },
  { name: "Romance", count: 70 }
];

class MockApiClient {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createResponse<T>(data: T): ApiResponse<T> {
    return {
      result_code: 200,
      msg: "success",
      data,
      timestamp: Date.now()
    };
  }

  async getHomeData(): Promise<HomeData> {
    await this.delay();
    
    const movies = mockAnimes.filter((anime: any) => anime.type === 'movie');
    const series = mockAnimes.filter((anime: any) => anime.type === 'series');
    
    return {
      latestMovies: movies as Anime[],
      latestSeries: series as Anime[]
    };
  }

  async getAnimeDetail(animeId: number): Promise<Anime> {
    await this.delay();
    
    const anime = mockAnimes.find((a: any) => a.id === animeId);
    if (!anime) {
      throw new Error('Anime not found');
    }
    
    return anime as Anime;
  }

  async getEpisodePlay(episodeId: number): Promise<{ episode: Episode; players: Player[] }> {
    await this.delay();
    
    // Simple mock episode
    const episode: Episode = {
      id: episodeId,
      animeId: 1,
      title: "Episode " + episodeId,
      number: episodeId,
      visitas: "1000",
      createdAt: "2024-01-01",
      originEpisodeId: episodeId.toString(),
      episodeNumber: episodeId
    };
    
    const players: Player[] = [{
      id: 1,
      animeId: 1,
      episodeId: episodeId,
      server: "Reproductor 1",
      link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      status: "active",
      createdAt: "2024-01-01"
    }];
    
    return { episode, players };
  }

  async getAnimeList(params: AnimeListParams = {}): Promise<{ animes: Anime[]; total: number; page: number; size: number }> {
    await this.delay();
    
    let filteredAnimes = [...mockAnimes];
    
    // Filter by type
    if (params.type) {
      filteredAnimes = filteredAnimes.filter((anime: any) => anime.type === params.type);
    }
    
    // Filter by genre
    if (params.genre) {
      filteredAnimes = filteredAnimes.filter((anime: any) => 
        anime.genres?.includes(params.genre!)
      );
    }
    
    // Filter by keyword
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredAnimes = filteredAnimes.filter((anime: any) =>
        anime.name?.toLowerCase().includes(keyword) ||
        anime.overview?.toLowerCase().includes(keyword)
      );
    }
    
    const page = params.page || 1;
    const size = params.size || 20;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    const paginatedAnimes = filteredAnimes.slice(startIndex, endIndex);
    
    return {
      animes: paginatedAnimes as Anime[],
      total: filteredAnimes.length,
      page,
      size
    };
  }

  async getGenres(): Promise<Genre[]> {
    await this.delay();
    return mockGenres;
  }

  async searchAnime(query: string, page = 1, size = 20): Promise<{ animes: Anime[]; total: number }> {
    await this.delay();
    
    const keyword = query.toLowerCase();
    const filteredAnimes = mockAnimes.filter((anime: any) =>
      anime.name?.toLowerCase().includes(keyword) ||
      anime.overview?.toLowerCase().includes(keyword)
    );
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedAnimes = filteredAnimes.slice(startIndex, endIndex);
    
    return {
      animes: paginatedAnimes as Anime[],
      total: filteredAnimes.length
    };
  }
}

export const mockApiClient = new MockApiClient();