import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Página no encontrada - 404',
  description: 'La página que buscas no existe. Explora nuestro catálogo de animes con subtítulos en español.',
  path: '/404',
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
          <p className="text-gray-400 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="btn-primary flex items-center justify-center w-full"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          
          <Link
            href="/buscar"
            className="btn-secondary flex items-center justify-center w-full"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar anime
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4">¿Buscas algo específico?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/peliculas" className="text-sm text-primary-400 hover:text-primary-300">
              Películas
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/series" className="text-sm text-primary-400 hover:text-primary-300">
              Series
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/generos" className="text-sm text-primary-400 hover:text-primary-300">
              Géneros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}