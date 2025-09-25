import { notFound } from 'next/navigation';
import { WatchPageClient } from '@/components/pages/WatchPageClient';
import { apiClient } from '@/lib/api';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const runtime = 'edge';

export async function generateMetadata({ params }: WatchPageProps) {
  try {
    const resolvedParams = await params;
    const episodeId = parseInt(resolvedParams.episodeId);
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
  params: Promise<{
    episodeId: string;
  }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const resolvedParams = await params;
  return <WatchPageClient episodeId={resolvedParams.episodeId} />;
}