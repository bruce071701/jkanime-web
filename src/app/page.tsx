import { Hero } from '@/components/sections/Hero';
import { HomeContent } from '@/components/sections/HomeContent';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <ErrorBoundary>
        <HomeContent />
      </ErrorBoundary>
    </div>
  );
}