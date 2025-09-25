import { MetadataRoute } from 'next';
import { apiClient } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkanimeflv.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/peliculas`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  try {
    // Get anime pages for sitemap
    const animeRoutes: MetadataRoute.Sitemap = [];
    
    // Get first few pages of animes for sitemap
    for (let page = 1; page <= 5; page++) {
      try {
        const response = await apiClient.getAnimeList({ page, size: 50 });
        
        response.animes.forEach((anime) => {
          animeRoutes.push({
            url: `${SITE_URL}/anime/${anime.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });

        // If we got less than 50 results, we've reached the end
        if (response.animes.length < 50) break;
      } catch (error) {
        console.error(`Error fetching page ${page} for sitemap:`, error);
        break;
      }
    }

    // Get genres for sitemap
    const genreRoutes: MetadataRoute.Sitemap = [];
    try {
      const genres = await apiClient.getGenres();
      
      genres.forEach((genre) => {
        genreRoutes.push(
          {
            url: `${SITE_URL}/peliculas?genre=${encodeURIComponent(genre.name)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          },
          {
            url: `${SITE_URL}/series?genre=${encodeURIComponent(genre.name)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          }
        );
      });
    } catch (error) {
      console.error('Error fetching genres for sitemap:', error);
    }

    return [...staticRoutes, ...animeRoutes, ...genreRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}