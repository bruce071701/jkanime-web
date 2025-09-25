import { notFound } from 'next/navigation';
import { WatchPageClient } from '@/components/pages/WatchPageClient';
import { apiClient } from '@/lib/api';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: WatchPageProps) {
  try {
    const episodeId = parseInt(params.episodeId);
    if (isNaN(episodeId)) return {};
    
    const data = await apiClient.getEpisodePlay(episodeId);
    const { episode } = data;
    
    const title = `Ver Episodio ${episode.episodeNumber}${episode.title ? ` - ${episode.title}` : ''}`;
    const description = `Mira el episodio ${episode.episodeNumber} online con subtítulos en español. Múltiples reproductores disponibles.`;
    
    return generateSEOMetadata({
      title,
      description,
      path: `/watch/${episodeId}`,
      keywords: ['ver', 'episodio', 'anime', 'online', 'español', 'subtítulos', 'gratis'],
      type: 'video.tv_show',
    });
  } catch (error) {
    return {};
  }
}

interface WatchPageProps {
  params: {
    episodeId: string;
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  return <WatchPageClient episodeId={params.episodeId} />;
}