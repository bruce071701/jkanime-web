import Link from 'next/link';
import { Play, Search } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 py-20">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido a <span className="text-primary-400">JKAnime FLV</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Ver anime online gratis en HD. La mejor plataforma para disfrutar 
            series y películas anime con subtítulos en español, latino y castellano.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/peliculas" 
              className="btn-primary flex items-center justify-center text-lg px-8 py-3"
            >
              <Play className="h-5 w-5 mr-2" />
              Ver Películas
            </Link>
            
            <Link 
              href="/series" 
              className="btn-secondary flex items-center justify-center text-lg px-8 py-3"
            >
              <Search className="h-5 w-5 mr-2" />
              Explorar Series
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-gray-900">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </section>
  );
}