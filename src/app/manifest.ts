import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JKAnime FLV - Ver Anime Online Gratis',
    short_name: 'JKAnime FLV',
    description: 'Ver anime online gratis en HD. JKAnime FLV - La mejor plataforma para disfrutar series y películas anime con subtítulos en español.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['entertainment', 'video', 'anime'],
    lang: 'es',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}