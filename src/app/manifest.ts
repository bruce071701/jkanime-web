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
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}