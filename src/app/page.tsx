import { Hero } from '@/components/sections/Hero';
import { HomeContent } from '@/components/sections/HomeContent';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'JKAnime FLV - Ver Anime Online Gratis en HD',
  description: 'Ver anime online gratis en HD en JKAnime FLV. La mejor plataforma para disfrutar series y películas anime con subtítulos en español, latino y castellano.',
  keywords: ['jkanime', 'animeflv', 'jkanimeflv', 'anime online', 'ver anime gratis', 'anime HD', 'subtítulos español', 'anime latino', 'anime castellano', 'streaming anime'],
});

export default function HomePage() {
  return (
    <div>
      <Hero />
      <HomeContent />
    </div>
  );
}