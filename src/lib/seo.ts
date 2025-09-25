import { Metadata } from 'next';
import { Anime } from '@/types/anime';

const SITE_NAME = 'JKAnime FLV';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkanimeflv.com';
const SITE_DESCRIPTION = 'Ver anime online gratis en HD en JKAnime FLV. La mejor plataforma para disfrutar series y películas anime con subtítulos en español, latino y castellano.';

export function generateMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'video.movie' | 'video.tv_show';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const desc = description || SITE_DESCRIPTION;
  const defaultImage = `${SITE_URL}/og-image.jpg`;
  const ogImage = image || defaultImage;

  const metadata: Metadata = {
    title: fullTitle,
    description: desc,
    keywords: keywords?.join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'es_ES',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
      creator: '@JKAnimeFLV',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add article-specific metadata
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
    };
  }

  return metadata;
}

export function generateAnimeMetadata(anime: Anime): Metadata {
  const title = anime.name;
  const description = anime.overview 
    ? `${anime.overview.substring(0, 155)}...`
    : `Mira ${anime.name} online con subtítulos en español. ${anime.type === 'movie' ? 'Película' : 'Serie'} de anime gratis en JKAnime FLV.`;
  
  const keywords = [
    anime.name,
    'jkanime',
    'animeflv',
    'jkanimeflv',
    'anime online',
    'ver anime gratis',
    'anime HD',
    'subtítulos español',
    anime.type === 'movie' ? 'película anime' : 'serie anime',
    'anime latino',
    'anime castellano',
    ...(Array.isArray(anime.genres) ? anime.genres : []),
  ];

  return generateMetadata({
    title,
    description,
    path: `/anime/${anime.id}`,
    image: anime.imagen,
    type: anime.type === 'movie' ? 'video.movie' : 'video.tv_show',
    keywords,
  });
}

export function generateListMetadata(
  type: 'movie' | 'series' | 'all',
  genre?: string,
  page?: number
): Metadata {
  const typeText = type === 'movie' ? 'Películas' : type === 'series' ? 'Series' : 'Animes';
  const genreText = genre ? ` de ${genre}` : '';
  const pageText = page && page > 1 ? ` - Página ${page}` : '';
  
  const title = `${typeText}${genreText} de Anime${pageText}`;
  const description = `Descubre las mejores ${typeText.toLowerCase()}${genreText} de anime con subtítulos en español. Contenido actualizado constantemente y gratis.`;
  
  const keywords = [
    'jkanime',
    'animeflv',
    'jkanimeflv',
    'anime online',
    'ver anime gratis',
    'anime HD',
    'subtítulos español',
    type === 'movie' ? 'películas anime' : 'series anime',
    'anime latino',
    'anime castellano',
    'streaming anime',
    ...(genre ? [genre] : []),
  ];

  const path = type === 'movie' ? '/peliculas' : type === 'series' ? '/series' : '/';

  return generateMetadata({
    title,
    description,
    path,
    keywords,
  });
}

export function generateStructuredData(anime: Anime) {
  const baseUrl = SITE_URL;
  
  return {
    '@context': 'https://schema.org',
    '@type': anime.type === 'movie' ? 'Movie' : 'TVSeries',
    name: anime.name,
    description: anime.overview,
    image: anime.imagen,
    url: `${baseUrl}/anime/${anime.id}`,
    genre: anime.genres,
    datePublished: anime.year ? `${anime.year}-01-01` : undefined,
    aggregateRating: anime.rating ? {
      '@type': 'AggregateRating',
      ratingValue: anime.rating,
      ratingCount: 100, // You might want to get this from your API
      bestRating: 10,
      worstRating: 1,
    } : undefined,
    contentRating: 'PG-13',
    inLanguage: 'es',
    subtitleLanguage: 'es',
    ...(anime.type === 'series' && anime.totalEpisodes && {
      numberOfEpisodes: anime.totalEpisodes,
    }),
  };
}