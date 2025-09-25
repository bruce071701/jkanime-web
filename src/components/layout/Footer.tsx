import Link from 'next/link';
import { Play } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Play className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">JKAnime<span className="text-primary-400">FLV</span></span>
            </Link>
            <p className="text-gray-400 mb-4">
              Ver anime online gratis en HD. JKAnime FLV es tu plataforma favorita para disfrutar 
              series y películas anime con subtítulos en español, latino y castellano.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/peliculas" className="text-gray-400 hover:text-white transition-colors">
                  Películas
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-gray-400 hover:text-white transition-colors">
                  Series
                </Link>
              </li>
              <li>
                <Link href="/generos" className="text-gray-400 hover:text-white transition-colors">
                  Géneros
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/acerca" className="text-gray-400 hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JKAnime FLV. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}