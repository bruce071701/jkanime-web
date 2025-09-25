import { ApiResponse, Anime, HomeData, Episode, Player, Genre, AnimeListParams } from '@/types/anime';

// Mock data for testing - 10 movies + 10 series to match real API
const mockAnimes: Anime[] = [
  // Movies (10)
  {
    id: 1,
    title: "Your Name",
    description: "Mitsuha, una estudiante de preparatoria que vive en el campo, sueña con la vida en la ciudad de Tokio. Taki, un estudiante de preparatoria que vive en Tokio, sueña con algo que no puede identificar.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/q719jXXEzOoYaps6babgKnONONX.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg",
    type: "movie",
    status: "completed",
    genres: ["Romance", "Drama", "Sobrenatural"],
    rating: 8.4,
    year: 2016,
    episodes: [{ id: 1, animeId: 1, title: "Your Name", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/q719jXXEzOoYaps6babgKnONONX.jpg", duration: "106 min", players: [{ id: 1, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 2,
    title: "Spirited Away",
    description: "Chihiro, una niña de 10 años, se muda con sus padres a un nuevo hogar. En el camino, entran en lo que su padre cree que es un parque temático abandonado, pero en realidad es un mundo habitado por espíritus.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/bSXfU4dwZyBA5vMmXvejdRXBvuF.jpg",
    type: "movie",
    status: "completed",
    genres: ["Aventura", "Familia", "Fantasía"],
    rating: 9.3,
    year: 2001,
    episodes: [{ id: 2, animeId: 2, title: "Spirited Away", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", duration: "125 min", players: [{ id: 2, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 3,
    title: "Princess Mononoke",
    description: "En la era Muromachi de Japón, un joven guerrero emishi llamado Ashitaka se ve envuelto en una lucha entre los dioses del bosque y los humanos que consumen sus recursos.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/cMYCDADoLKLbB83g4WnJegaZimC.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/8pTHNQlWpuYAqyHN1kCQeqbbNTz.jpg",
    type: "movie",
    status: "completed",
    genres: ["Aventura", "Drama", "Fantasía"],
    rating: 8.4,
    year: 1997,
    episodes: [{ id: 3, animeId: 3, title: "Princess Mononoke", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/cMYCDADoLKLbB83g4WnJegaZimC.jpg", duration: "134 min", players: [{ id: 3, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 4,
    title: "Akira",
    description: "En el Neo-Tokio de 2019, Shotaro Kaneda, líder de una pandilla de motociclistas, trata de salvar a su amigo Tetsuo Shima de un experimento del gobierno que lo convierte en un psíquico con poderes destructivos.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/aKTKDO3JuoQJ9p4hbMXeT0GSXbW.jpg",
    type: "movie",
    status: "completed",
    genres: ["Acción", "Ciencia Ficción", "Thriller"],
    rating: 8.0,
    year: 1988,
    episodes: [{ id: 4, animeId: 4, title: "Akira", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg", duration: "124 min", players: [{ id: 4, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 5,
    title: "Ghost in the Shell",
    description: "En el año 2029, la barrera entre el mundo real y el cibernético se ha desvanecido. Una unidad de élite de la policía cibernética se enfrenta a un hacker conocido como el Titiritero.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/fRtaDgVIbXvBpTuqEI1NLdcNh1o.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/aJCtkxLLzkk1pECehVjKHA2lBgw.jpg",
    type: "movie",
    status: "completed",
    genres: ["Acción", "Ciencia Ficción", "Thriller"],
    rating: 8.0,
    year: 1995,
    episodes: [{ id: 5, animeId: 5, title: "Ghost in the Shell", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/fRtaDgVIbXvBpTuqEI1NLdcNh1o.jpg", duration: "83 min", players: [{ id: 5, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 6,
    title: "Perfect Blue",
    description: "Mima Kirigoe, una cantante de J-pop, decide dejar su grupo para convertirse en actriz, pero pronto se ve acosada por un fan obsesivo y comienza a perder el contacto con la realidad.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/79vujMksKYL2kCiIbWf5Gm4ZmKG.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/cgo3PmBcZSHjBjwQAKiNjUysDAd.jpg",
    type: "movie",
    status: "completed",
    genres: ["Drama", "Horror", "Thriller"],
    rating: 8.0,
    year: 1997,
    episodes: [{ id: 6, animeId: 6, title: "Perfect Blue", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/79vujMksKYL2kCiIbWf5Gm4ZmKG.jpg", duration: "81 min", players: [{ id: 6, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 7,
    title: "Howl's Moving Castle",
    description: "Sophie, una joven trabajadora de una sombrería, es transformada en una anciana por una bruja. Busca la ayuda del mago Howl y su castillo ambulante para romper la maldición.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/TkTPELv4kC3u1lkloush9Orl3Dd.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/6pZgH10jhpToPcf0uvyTCPFhWpI.jpg",
    type: "movie",
    status: "completed",
    genres: ["Aventura", "Familia", "Fantasía"],
    rating: 8.2,
    year: 2004,
    episodes: [{ id: 7, animeId: 7, title: "Howl's Moving Castle", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/TkTPELv4kC3u1lkloush9Orl3Dd.jpg", duration: "119 min", players: [{ id: 7, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 8,
    title: "Castle in the Sky",
    description: "Una joven llamada Sheeta cae del cielo y es rescatada por Pazu, un joven minero. Juntos buscan el legendario castillo flotante de Laputa mientras son perseguidos por piratas y agentes del gobierno.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/npOnzAbLh6VOIu3naU5QaEcTepo.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/3NCgmJaq6ykZwhGn3QCnGlapyr.jpg",
    type: "movie",
    status: "completed",
    genres: ["Aventura", "Familia", "Fantasía"],
    rating: 8.0,
    year: 1986,
    episodes: [{ id: 8, animeId: 8, title: "Castle in the Sky", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/npOnzAbLh6VOIu3naU5QaEcTepo.jpg", duration: "125 min", players: [{ id: 8, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 9,
    title: "My Neighbor Totoro",
    description: "Dos hermanas se mudan al campo con su padre para estar cerca de su madre hospitalizada, y descubren que los bosques cercanos están habitados por criaturas mágicas llamadas Totoros.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/etqr6fOOCXQOgwrQXaKwenTSuzx.jpg",
    type: "movie",
    status: "completed",
    genres: ["Aventura", "Familia", "Fantasía"],
    rating: 8.2,
    year: 1988,
    episodes: [{ id: 9, animeId: 9, title: "My Neighbor Totoro", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg", duration: "86 min", players: [{ id: 9, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 10,
    title: "Grave of the Fireflies",
    description: "Durante los últimos meses de la Segunda Guerra Mundial, dos hermanos huérfanos luchan por sobrevivir en el Japón devastado por la guerra.",
    poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/k9tv1rXZbOhH7eiCk378x61kNQ1.jpg",
    banner: "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/vkZSd0Lp8iCVBGpFH9L7LzLusjS.jpg",
    type: "movie",
    status: "completed",
    genres: ["Drama", "Guerra", "Histórico"],
    rating: 8.5,
    year: 1988,
    episodes: [{ id: 10, animeId: 10, title: "Grave of the Fireflies", episodeNumber: 1, thumbnail: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/k9tv1rXZbOhH7eiCk378x61kNQ1.jpg", duration: "89 min", players: [{ id: 10, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  // Series (10)
  {
    id: 11,
    title: "Attack on Titan",
    description: "La humanidad vive dentro de ciudades rodeadas por enormes muros debido a los Titanes, gigantescas criaturas humanoides que devoran a los humanos aparentemente sin razón.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "completed",
    genres: ["Acción", "Drama", "Fantasía"],
    rating: 9.0,
    year: 2013,
    totalEpisodes: 87,
    episodes: [{ id: 11, animeId: 11, title: "A ti, dentro de 2000 años", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "24 min", players: [{ id: 11, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 12,
    title: "Demon Slayer",
    description: "Tanjiro Kamado es un joven que vive con su familia en las montañas. Se convierte en cazador de demonios después de que su familia es masacrada y su hermana menor Nezuko se convierte en demonio.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "ongoing",
    genres: ["Acción", "Histórico", "Sobrenatural"],
    rating: 8.7,
    year: 2019,
    totalEpisodes: 44,
    episodes: [{ id: 12, animeId: 12, title: "Crueldad", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "23 min", players: [{ id: 12, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 13,
    title: "One Piece",
    description: "Monkey D. Luffy es un joven pirata que sueña con encontrar el tesoro más grande del mundo conocido como 'One Piece' y convertirse en el próximo Rey de los Piratas.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "ongoing",
    genres: ["Aventura", "Comedia", "Acción"],
    rating: 9.0,
    year: 1999,
    totalEpisodes: 1000,
    episodes: [{ id: 13, animeId: 13, title: "Soy Luffy! ¡El hombre que será el Rey de los Piratas!", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "24 min", players: [{ id: 13, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 14,
    title: "My Hero Academia",
    description: "En un mundo donde el 80% de la población tiene superpoderes llamados 'Quirks', Izuku Midoriya sueña con convertirse en un héroe a pesar de nacer sin poderes.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "ongoing",
    genres: ["Acción", "Escolar", "Superhéroes"],
    rating: 8.5,
    year: 2016,
    totalEpisodes: 138,
    episodes: [{ id: 14, animeId: 14, title: "Izuku Midoriya: Origen", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "24 min", players: [{ id: 14, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 15,
    title: "Naruto",
    description: "Naruto Uzumaki es un joven ninja que busca reconocimiento de sus compañeros y sueña con convertirse en el Hokage, el líder de su aldea.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "completed",
    genres: ["Acción", "Aventura", "Artes Marciales"],
    rating: 8.3,
    year: 2002,
    totalEpisodes: 720,
    episodes: [{ id: 15, animeId: 15, title: "Entra: Naruto Uzumaki", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "23 min", players: [{ id: 15, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 16,
    title: "Dragon Ball Z",
    description: "Goku y sus amigos defienden la Tierra de una variedad de villanos que van desde conquistadores espaciales, androides increíblemente poderosos y criaturas mágicas destructivas.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "completed",
    genres: ["Acción", "Aventura", "Artes Marciales"],
    rating: 8.7,
    year: 1989,
    totalEpisodes: 291,
    episodes: [{ id: 16, animeId: 16, title: "El Nuevo Peligro", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "24 min", players: [{ id: 16, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 17,
    title: "Death Note",
    description: "Un estudiante de secundaria encuentra un cuaderno sobrenatural que le permite matar a cualquier persona cuyo nombre escriba en él, y decide usarlo para limpiar el mundo del mal.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "completed",
    genres: ["Drama", "Sobrenatural", "Thriller"],
    rating: 9.0,
    year: 2006,
    totalEpisodes: 37,
    episodes: [{ id: 17, animeId: 17, title: "Renacimiento", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "23 min", players: [{ id: 17, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 18,
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Dos hermanos alquimistas buscan la Piedra Filosofal para restaurar sus cuerpos después de un intento fallido de resucitar a su madre usando alquimia prohibida.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "completed",
    genres: ["Acción", "Aventura", "Drama"],
    rating: 9.1,
    year: 2009,
    totalEpisodes: 64,
    episodes: [{ id: 18, animeId: 18, title: "Fullmetal Alchemist", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "24 min", players: [{ id: 18, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 19,
    title: "Hunter x Hunter",
    description: "Gon Freecss descubre que su padre, quien pensaba que estaba muerto, es en realidad un Hunter de renombre mundial, una licencia especial que se otorga solo a aquellos que han demostrado ser capaces.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "completed",
    genres: ["Acción", "Aventura", "Fantasía"],
    rating: 9.0,
    year: 2011,
    totalEpisodes: 148,
    episodes: [{ id: 19, animeId: 19, title: "Partida × Y × Amigos", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "23 min", players: [{ id: 19, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  },
  {
    id: 20,
    title: "One Punch Man",
    description: "Saitama es un superhéroe que puede derrotar a cualquier enemigo con un solo golpe, pero lucha contra el aburrimiento que viene con su abrumadora fuerza.",
    poster: "/placeholder-anime.jpg",
    banner: "/placeholder-anime.jpg",
    type: "series",
    status: "ongoing",
    genres: ["Acción", "Comedia", "Superhéroes"],
    rating: 8.7,
    year: 2015,
    totalEpisodes: 24,
    episodes: [{ id: 20, animeId: 20, title: "El Hombre Más Fuerte", episodeNumber: 1, thumbnail: "/placeholder-anime.jpg", duration: "24 min", players: [{ id: 20, name: "Reproductor 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "HD", type: "iframe" }] }]
  }
];

const mockGenres: Genre[] = [
  { name: "Acción", count: 150 },
  { name: "Aventura", count: 120 },
  { name: "Comedia", count: 80 },
  { name: "Drama", count: 200 },
  { name: "Fantasía", count: 90 },
  { name: "Romance", count: 70 },
  { name: "Ciencia Ficción", count: 60 },
  { name: "Thriller", count: 45 },
  { name: "Horror", count: 30 },
  { name: "Histórico", count: 25 }
];

class MockApiClient {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createResponse<T>(data: T): ApiResponse<T> {
    return {
      code: 200,
      message: "success",
      data,
      timestamp: Date.now()
    };
  }

  async getHomeData(): Promise<HomeData> {
    await this.delay();
    console.log('Mock API: Getting home data');
    
    const movies = mockAnimes.filter(anime => anime.type === 'movie');
    const series = mockAnimes.filter(anime => anime.type === 'series');
    
    return {
      latestMovies: movies,
      latestSeries: series
    };
  }

  async getAnimeDetail(animeId: number): Promise<Anime> {
    await this.delay();
    console.log(`Mock API: Getting anime detail for ID ${animeId}`);
    
    const anime = mockAnimes.find(a => a.id === animeId);
    if (!anime) {
      throw new Error('Anime not found');
    }
    
    return anime;
  }

  async getEpisodePlay(episodeId: number): Promise<{ episode: Episode; players: Player[] }> {
    await this.delay();
    console.log(`Mock API: Getting episode play data for ID ${episodeId}`);
    
    // Find episode in any anime
    for (const anime of mockAnimes) {
      if (anime.episodes) {
        const episode = anime.episodes.find(ep => ep.id === episodeId);
        if (episode) {
          return {
            episode,
            players: episode.players || []
          };
        }
      }
    }
    
    throw new Error('Episode not found');
  }

  async getAnimeList(params: AnimeListParams = {}): Promise<{ animes: Anime[]; total: number; page: number; size: number }> {
    await this.delay();
    console.log('Mock API: Getting anime list with params:', params);
    
    let filteredAnimes = [...mockAnimes];
    
    // Filter by type
    if (params.type) {
      filteredAnimes = filteredAnimes.filter(anime => anime.type === params.type);
    }
    
    // Filter by genre
    if (params.genre) {
      filteredAnimes = filteredAnimes.filter(anime => 
        anime.genres?.includes(params.genre!)
      );
    }
    
    // Filter by keyword
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredAnimes = filteredAnimes.filter(anime =>
        anime.title.toLowerCase().includes(keyword) ||
        anime.description?.toLowerCase().includes(keyword)
      );
    }
    
    // Sort
    if (params.sort) {
      switch (params.sort) {
        case 'rating':
          filteredAnimes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popular':
          filteredAnimes.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Mock popularity with rating
          break;
        case 'latest':
        default:
          filteredAnimes.sort((a, b) => (b.year || 0) - (a.year || 0));
          break;
      }
    }
    
    const page = params.page || 1;
    const size = params.size || 20;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    const paginatedAnimes = filteredAnimes.slice(startIndex, endIndex);
    
    return {
      animes: paginatedAnimes,
      total: filteredAnimes.length,
      page,
      size
    };
  }

  async getGenres(): Promise<Genre[]> {
    await this.delay();
    console.log('Mock API: Getting genres');
    
    return mockGenres;
  }

  async searchAnime(query: string, page = 1, size = 20): Promise<{ animes: Anime[]; total: number }> {
    await this.delay();
    console.log(`Mock API: Searching for "${query}"`);
    
    const keyword = query.toLowerCase();
    const filteredAnimes = mockAnimes.filter(anime =>
      anime.title.toLowerCase().includes(keyword) ||
      anime.description?.toLowerCase().includes(keyword) ||
      anime.genres?.some(genre => genre.toLowerCase().includes(keyword))
    );
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedAnimes = filteredAnimes.slice(startIndex, endIndex);
    
    return {
      animes: paginatedAnimes,
      total: filteredAnimes.length
    };
  }
}

export const mockApiClient = new MockApiClient();